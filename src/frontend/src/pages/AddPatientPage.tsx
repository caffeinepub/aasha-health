import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate, useParams } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, Loader2, Lock, Save } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  useAddPatient,
  useGetPatient,
  useUpdatePatient,
} from "../hooks/useQueries";
import { decrypt, encrypt } from "../lib/encryption";

const BLOOD_TYPES = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

interface Props {
  editMode?: boolean;
}

export default function AddPatientPage({ editMode }: Props) {
  const navigate = useNavigate();
  const params = useParams({ strict: false }) as { patientId?: string };
  const patientId = params?.patientId;

  const { data: existingPatient } = useGetPatient(patientId || "");
  const addPatient = useAddPatient();
  const updatePatient = useUpdatePatient();

  const [form, setForm] = useState({
    name: "",
    age: "",
    bloodType: "",
    notes: "",
    emergencyContact: "",
    emergencyPhone: "",
  });

  useEffect(() => {
    if (editMode && existingPatient) {
      setForm({
        name: decrypt(existingPatient.encryptedName),
        age: decrypt(existingPatient.encryptedAge),
        bloodType: existingPatient.bloodType,
        notes: decrypt(existingPatient.encryptedNotes),
        emergencyContact: decrypt(existingPatient.encryptedEmergencyContact),
        emergencyPhone: existingPatient.emergencyPhone,
      });
    }
  }, [editMode, existingPatient]);

  const isPending = addPatient.isPending || updatePatient.isPending;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.bloodType) {
      toast.error("Name and Blood Type are required.");
      return;
    }
    try {
      const payload = {
        encryptedName: encrypt(form.name),
        encryptedAge: encrypt(form.age),
        bloodType: form.bloodType,
        encryptedNotes: encrypt(form.notes),
        encryptedEmergencyContact: encrypt(form.emergencyContact),
        emergencyPhone: form.emergencyPhone,
      };
      if (editMode && patientId) {
        await updatePatient.mutateAsync({ id: patientId, ...payload });
        toast.success("Patient updated successfully");
        navigate({ to: "/patients/$patientId", params: { patientId } });
      } else {
        const newId = await addPatient.mutateAsync(payload);
        toast.success("Patient added successfully");
        navigate({ to: "/patients/$patientId", params: { patientId: newId } });
      }
    } catch {
      toast.error("Failed to save patient. Please try again.");
    }
  };

  const set =
    (field: string) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((prev) => ({ ...prev, [field]: e.target.value }));

  return (
    <div className="max-w-2xl mx-auto space-y-6" data-ocid="add_patient.page">
      <div className="flex items-center gap-3">
        <Link to="/patients">
          <Button variant="ghost" size="sm" data-ocid="add_patient.back.button">
            <ArrowLeft className="w-4 h-4 mr-1" /> Back
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            {editMode ? "Edit Patient" : "Add Patient"}
          </h1>
          <p className="text-sm text-muted-foreground">
            Fields marked with 🔒 are encrypted before storage.
          </p>
        </div>
      </div>

      <Card className="border-border">
        <CardHeader>
          <CardTitle className="text-base">Patient Information</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="name">Full Name 🔒</Label>
                <Input
                  id="name"
                  data-ocid="add_patient.name.input"
                  placeholder="Patient full name"
                  value={form.name}
                  onChange={set("name")}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="age">Age 🔒</Label>
                <Input
                  id="age"
                  data-ocid="add_patient.age.input"
                  placeholder="e.g. 35"
                  value={form.age}
                  onChange={set("age")}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label>Blood Type</Label>
              <Select
                value={form.bloodType}
                onValueChange={(v) =>
                  setForm((prev) => ({ ...prev, bloodType: v }))
                }
              >
                <SelectTrigger data-ocid="add_patient.blood_type.select">
                  <SelectValue placeholder="Select blood type" />
                </SelectTrigger>
                <SelectContent>
                  {BLOOD_TYPES.map((bt) => (
                    <SelectItem key={bt} value={bt}>
                      {bt}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="notes">Medical Notes 🔒</Label>
              <Textarea
                id="notes"
                data-ocid="add_patient.notes.textarea"
                placeholder="Allergies, conditions, medications…"
                value={form.notes}
                onChange={set("notes")}
                rows={3}
              />
            </div>

            <div className="border-t border-border pt-4 space-y-4">
              <p className="text-sm font-semibold text-foreground">
                Emergency Contact
              </p>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="ec-name">Contact Name 🔒</Label>
                  <Input
                    id="ec-name"
                    data-ocid="add_patient.emergency_contact.input"
                    placeholder="Emergency contact name"
                    value={form.emergencyContact}
                    onChange={set("emergencyContact")}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="ec-phone">Phone Number</Label>
                  <Input
                    id="ec-phone"
                    data-ocid="add_patient.emergency_phone.input"
                    placeholder="+91 XXXXX XXXXX"
                    type="tel"
                    value={form.emergencyPhone}
                    onChange={set("emergencyPhone")}
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <Button
                type="submit"
                data-ocid="add_patient.submit_button"
                disabled={isPending}
                className="flex-1"
                style={{ background: "oklch(var(--primary))", color: "white" }}
              >
                {isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />{" "}
                    {editMode ? "Update Patient" : "Add Patient"}
                  </>
                )}
              </Button>
              <Link to="/patients">
                <Button
                  type="button"
                  variant="outline"
                  data-ocid="add_patient.cancel_button"
                >
                  Cancel
                </Button>
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
