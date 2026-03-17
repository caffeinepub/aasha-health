import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { PatientRecord, UserProfile } from "../backend";
import { useActor } from "./useActor";

export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();
  const query = useQuery<UserProfile | null>({
    queryKey: ["currentUserProfile"],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not available");
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });
  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error("Actor not available");
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentUserProfile"] });
    },
  });
}

export function useIsAdmin() {
  const { actor, isFetching } = useActor();
  return useQuery<boolean>({
    queryKey: ["isAdmin"],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useListPatients() {
  const { actor, isFetching } = useActor();
  return useQuery<PatientRecord[]>({
    queryKey: ["patients"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listPatients();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetPatient(id: string) {
  const { actor, isFetching } = useActor();
  return useQuery<PatientRecord | null>({
    queryKey: ["patient", id],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getPatient(id);
    },
    enabled: !!actor && !isFetching && !!id,
  });
}

export function useAddPatient() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (args: {
      encryptedName: string;
      encryptedAge: string;
      bloodType: string;
      encryptedNotes: string;
      encryptedEmergencyContact: string;
      emergencyPhone: string;
    }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.addPatient(
        args.encryptedName,
        args.encryptedAge,
        args.bloodType,
        args.encryptedNotes,
        args.encryptedEmergencyContact,
        args.emergencyPhone,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["patients"] });
    },
  });
}

export function useUpdatePatient() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (args: {
      id: string;
      encryptedName: string;
      encryptedAge: string;
      bloodType: string;
      encryptedNotes: string;
      encryptedEmergencyContact: string;
      emergencyPhone: string;
    }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.updatePatient(
        args.id,
        args.encryptedName,
        args.encryptedAge,
        args.bloodType,
        args.encryptedNotes,
        args.encryptedEmergencyContact,
        args.emergencyPhone,
      );
    },
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: ["patients"] });
      queryClient.invalidateQueries({ queryKey: ["patient", vars.id] });
    },
  });
}

export function useDeletePatient() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error("Actor not available");
      return actor.deletePatient(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["patients"] });
    },
  });
}
