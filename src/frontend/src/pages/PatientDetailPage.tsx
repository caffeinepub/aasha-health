import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link, useParams } from "@tanstack/react-router";
import {
  ArrowLeft,
  Download,
  Droplet,
  Loader2,
  Lock,
  Pencil,
  Phone,
  QrCode,
  User,
} from "lucide-react";
import { useGetPatient } from "../hooks/useQueries";
import { decrypt } from "../lib/encryption";

function QRCodeImage({ patientId }: { patientId: string }) {
  const url = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(patientId)}&bgcolor=ffffff&color=0B2D4D&margin=10`;

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = url;
    link.download = `aasha-patient-${patientId.slice(0, 8)}.png`;
    link.click();
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <img
        src={url}
        alt="Patient QR Code"
        className="w-48 h-48 rounded-xl border border-border"
      />
      <Button
        variant="outline"
        size="sm"
        data-ocid="patient_detail.download_qr.button"
        onClick={handleDownload}
      >
        <Download className="w-4 h-4 mr-2" /> Download QR
      </Button>
    </div>
  );
}

export default function PatientDetailPage() {
  const params = useParams({ from: "/app/patients/$patientId" });
  const { data: patient, isLoading } = useGetPatient(params.patientId);

  if (isLoading) {
    return (
      <div
        className="flex items-center justify-center py-20"
        data-ocid="patient_detail.loading_state"
      >
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="text-center py-20" data-ocid="patient_detail.error_state">
        <p className="text-muted-foreground">Patient not found.</p>
        <Link to="/patients">
          <Button variant="outline" className="mt-4">
            Back to Patients
          </Button>
        </Link>
      </div>
    );
  }

  const name = decrypt(patient.encryptedName);
  const age = decrypt(patient.encryptedAge);
  const notes = decrypt(patient.encryptedNotes);
  const emergencyContact = decrypt(patient.encryptedEmergencyContact);

  return (
    <div
      className="max-w-3xl mx-auto space-y-6"
      data-ocid="patient_detail.page"
    >
      <div className="flex items-center gap-3">
        <Link to="/patients">
          <Button
            variant="ghost"
            size="sm"
            data-ocid="patient_detail.back.button"
          >
            <ArrowLeft className="w-4 h-4 mr-1" /> Back
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-foreground">{name}</h1>
          <p className="text-xs font-mono text-muted-foreground">
            ID: {patient.patientId}
          </p>
        </div>
        <Link
          to="/patients/$patientId/edit"
          params={{ patientId: patient.patientId }}
        >
          <Button
            variant="outline"
            size="sm"
            data-ocid="patient_detail.edit.button"
          >
            <Pencil className="w-4 h-4 mr-1" /> Edit
          </Button>
        </Link>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Patient Info */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <User className="w-4 h-4" /> Patient Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <InfoRow
              icon={<Lock className="w-3.5 h-3.5 text-muted-foreground" />}
              label="Full Name"
              value={name}
            />
            <InfoRow
              icon={<Lock className="w-3.5 h-3.5 text-muted-foreground" />}
              label="Age"
              value={age ? `${age} years` : "—"}
            />
            <div className="flex items-center justify-between py-1">
              <span className="text-sm text-muted-foreground flex items-center gap-1.5">
                <Droplet className="w-3.5 h-3.5" /> Blood Type
              </span>
              <Badge className="bg-red-100 text-red-700 border-red-200">
                {patient.bloodType}
              </Badge>
            </div>
            <InfoRow
              icon={<Lock className="w-3.5 h-3.5 text-muted-foreground" />}
              label="Medical Notes"
              value={notes || "No notes recorded"}
              multiline
            />
            <div className="text-xs text-muted-foreground pt-2 border-t border-border">
              Added:{" "}
              {new Date(
                Number(patient.createdAt) / 1_000_000,
              ).toLocaleDateString()}
            </div>
          </CardContent>
        </Card>

        {/* QR Code */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <QrCode className="w-4 h-4" /> Patient QR Code
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <QRCodeImage patientId={patient.patientId} />
            <p className="text-xs text-muted-foreground text-center mt-3">
              Scan this code to instantly access this patient's record.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Emergency Contact */}
      <Card className="border-red-100" style={{ borderColor: "#FEE2E2" }}>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2 text-red-700">
            <Phone className="w-4 h-4" /> Emergency Contact
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5" />{" "}
                {emergencyContact || "Not specified"}
              </p>
              <p className="font-mono text-foreground">
                {patient.emergencyPhone || "No phone on record"}
              </p>
            </div>
            {patient.emergencyPhone && (
              <a href={`tel:${patient.emergencyPhone}`}>
                <Button
                  data-ocid="patient_detail.emergency_call.button"
                  className="bg-red-600 hover:bg-red-700 text-white rounded-xl px-6"
                >
                  <Phone className="w-4 h-4 mr-2" /> Call Now
                </Button>
              </a>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function InfoRow({
  icon,
  label,
  value,
  multiline,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  multiline?: boolean;
}) {
  return (
    <div className="py-1">
      <span className="text-xs text-muted-foreground flex items-center gap-1.5 mb-0.5">
        {icon} {label}
      </span>
      <p
        className={`text-sm text-foreground font-medium ${multiline ? "whitespace-pre-wrap" : ""}`}
      >
        {value || "—"}
      </p>
    </div>
  );
}
