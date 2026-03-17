import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Link } from "@tanstack/react-router";
import {
  Eye,
  Loader2,
  Pencil,
  Search,
  Trash2,
  UserPlus,
  Users,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useDeletePatient, useListPatients } from "../hooks/useQueries";
import { decrypt } from "../lib/encryption";

export default function PatientsPage() {
  const { data: patients = [], isLoading } = useListPatients();
  const deletePatient = useDeletePatient();
  const [search, setSearch] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const filtered = patients.filter(
    (p) =>
      p.patientId.toLowerCase().includes(search.toLowerCase()) ||
      decrypt(p.encryptedName).toLowerCase().includes(search.toLowerCase()),
  );

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deletePatient.mutateAsync(deleteId);
      toast.success("Patient deleted successfully");
    } catch {
      toast.error("Failed to delete patient");
    } finally {
      setDeleteId(null);
    }
  };

  return (
    <div className="space-y-6" data-ocid="patients.page">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Patients</h1>
          <p className="text-sm text-muted-foreground">
            {patients.length} total records
          </p>
        </div>
        <Link to="/patients/add">
          <Button
            data-ocid="patients.add_patient.button"
            style={{ background: "oklch(var(--primary))", color: "white" }}
          >
            <UserPlus className="w-4 h-4 mr-2" /> Add Patient
          </Button>
        </Link>
      </div>

      <Card className="border-border">
        <CardHeader>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              data-ocid="patients.search_input"
              placeholder="Search by Patient ID or name…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div
              className="flex items-center justify-center py-12"
              data-ocid="patients.loading_state"
            >
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
          ) : filtered.length === 0 ? (
            <div
              className="text-center py-12 text-muted-foreground"
              data-ocid="patients.empty_state"
            >
              <Users className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p className="text-sm">
                {search ? "No patients match your search." : "No patients yet."}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {filtered.map((p, idx) => (
                <div
                  key={p.patientId}
                  data-ocid={`patients.item.${idx + 1}`}
                  className="flex items-center gap-3 px-4 py-3"
                >
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
                    style={{ background: "oklch(var(--accent))" }}
                  >
                    {decrypt(p.encryptedName)?.charAt(0)?.toUpperCase() || "P"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {decrypt(p.encryptedName) || "Unknown"}
                    </p>
                    <p className="text-xs text-muted-foreground font-mono">
                      {p.patientId.slice(0, 16)}…
                    </p>
                  </div>
                  <Badge variant="outline" className="flex-shrink-0">
                    {p.bloodType}
                  </Badge>
                  <div className="flex items-center gap-1">
                    <Link
                      to="/patients/$patientId"
                      params={{ patientId: p.patientId }}
                    >
                      <Button
                        variant="ghost"
                        size="sm"
                        data-ocid={`patients.view.button.${idx + 1}`}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    </Link>
                    <Link
                      to="/patients/$patientId/edit"
                      params={{ patientId: p.patientId }}
                    >
                      <Button
                        variant="ghost"
                        size="sm"
                        data-ocid={`patients.edit_button.${idx + 1}`}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      size="sm"
                      data-ocid={`patients.delete_button.${idx + 1}`}
                      onClick={() => setDeleteId(p.patientId)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <AlertDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
      >
        <AlertDialogContent data-ocid="patients.delete.dialog">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Patient?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The patient record will be
              permanently removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-ocid="patients.delete.cancel_button">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              data-ocid="patients.delete.confirm_button"
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {deletePatient.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
