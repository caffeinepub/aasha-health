import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface PatientRecord {
    bloodType: string;
    owner: Principal;
    patientId: string;
    encryptedNotes: string;
    createdAt: bigint;
    encryptedAge: string;
    emergencyPhone: string;
    encryptedEmergencyContact: string;
    encryptedName: string;
}
export interface UserProfile {
    name: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addPatient(encryptedName: string, encryptedAge: string, bloodType: string, encryptedNotes: string, encryptedEmergencyContact: string, emergencyPhone: string): Promise<string>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    deletePatient(id: string): Promise<void>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getPatient(id: string): Promise<PatientRecord | null>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    listPatients(): Promise<Array<PatientRecord>>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    updatePatient(id: string, encryptedName: string, encryptedAge: string, bloodType: string, encryptedNotes: string, encryptedEmergencyContact: string, emergencyPhone: string): Promise<void>;
}
