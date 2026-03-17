import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "@tanstack/react-router";
import {
  Camera,
  Loader2,
  QrCode,
  SwitchCamera,
  UserCheck,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useGetPatient } from "../hooks/useQueries";
import { decrypt } from "../lib/encryption";
import { useQRScanner } from "../qr-code/useQRScanner";

export default function QRScannerPage() {
  const [scannedId, setScannedId] = useState<string | null>(null);

  const {
    qrResults,
    isActive,
    isSupported,
    error,
    isLoading,
    canStartScanning,
    startScanning,
    stopScanning,
    switchCamera,
    clearResults,
    videoRef,
    canvasRef,
  } = useQRScanner({
    facingMode: "environment",
    scanInterval: 100,
    maxResults: 3,
  });

  const { data: patient, isLoading: patientLoading } = useGetPatient(
    scannedId || "",
  );

  useEffect(() => {
    if (qrResults.length > 0 && !scannedId) {
      const id = qrResults[0].data;
      setScannedId(id);
      stopScanning();
    }
  }, [qrResults, scannedId, stopScanning]);

  const handleReset = () => {
    setScannedId(null);
    clearResults();
  };

  const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

  return (
    <div className="max-w-lg mx-auto space-y-6" data-ocid="qr_scanner.page">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Scan QR Code</h1>
        <p className="text-sm text-muted-foreground">
          Scan a patient's QR code to view their record.
        </p>
      </div>

      {isSupported === false && (
        <div
          className="text-center py-12 text-muted-foreground"
          data-ocid="qr_scanner.error_state"
        >
          <Camera className="w-12 h-12 mx-auto mb-4 opacity-40" />
          <p>Camera is not supported on this device.</p>
        </div>
      )}

      {isSupported !== false && !scannedId && (
        <Card className="border-border overflow-hidden">
          <CardContent className="p-0">
            <div className="relative bg-black" style={{ aspectRatio: "4/3" }}>
              <video
                ref={videoRef}
                className="w-full h-full object-cover"
                playsInline
                muted
              />
              <canvas ref={canvasRef} className="hidden" />
              {!isActive && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/60">
                  <div className="text-center text-white">
                    <QrCode className="w-12 h-12 mx-auto mb-3 opacity-60" />
                    <p className="text-sm opacity-70">
                      Camera preview will appear here
                    </p>
                  </div>
                </div>
              )}
              {isActive && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-48 h-48 border-2 border-white/80 rounded-xl" />
                </div>
              )}
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                  <Loader2 className="w-8 h-8 text-white animate-spin" />
                </div>
              )}
            </div>

            {error && (
              <div
                className="px-4 py-3 bg-red-50 text-red-700 text-sm"
                data-ocid="qr_scanner.error_state"
              >
                {error.message}
              </div>
            )}

            <div className="p-4 flex gap-3">
              {!isActive ? (
                <Button
                  data-ocid="qr_scanner.start.button"
                  onClick={startScanning}
                  disabled={!canStartScanning}
                  className="flex-1"
                  style={{
                    background: "oklch(var(--primary))",
                    color: "white",
                  }}
                >
                  <Camera className="w-4 h-4 mr-2" /> Start Scanning
                </Button>
              ) : (
                <Button
                  data-ocid="qr_scanner.stop.button"
                  variant="outline"
                  onClick={stopScanning}
                  className="flex-1"
                >
                  <X className="w-4 h-4 mr-2" /> Stop
                </Button>
              )}
              {isMobile && isActive && (
                <Button
                  data-ocid="qr_scanner.switch_camera.button"
                  variant="outline"
                  onClick={switchCamera}
                  disabled={isLoading}
                >
                  <SwitchCamera className="w-4 h-4" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {scannedId && (
        <Card className="border-border" data-ocid="qr_scanner.result.card">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Scan Result</CardTitle>
            <Button
              variant="ghost"
              size="sm"
              data-ocid="qr_scanner.reset.button"
              onClick={handleReset}
            >
              <X className="w-4 h-4 mr-1" /> Reset
            </Button>
          </CardHeader>
          <CardContent>
            {patientLoading ? (
              <div
                className="flex items-center gap-2 py-4"
                data-ocid="qr_scanner.patient.loading_state"
              >
                <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  Looking up patient…
                </span>
              </div>
            ) : patient ? (
              <div
                className="space-y-4"
                data-ocid="qr_scanner.patient.success_state"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold"
                    style={{ background: "oklch(var(--accent))" }}
                  >
                    <UserCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-bold text-foreground">
                      {decrypt(patient.encryptedName)}
                    </p>
                    <p className="text-xs text-muted-foreground font-mono">
                      {patient.patientId.slice(0, 16)}…
                    </p>
                  </div>
                  <Badge className="ml-auto bg-red-100 text-red-700 border-red-200">
                    {patient.bloodType}
                  </Badge>
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="p-3 rounded-xl bg-muted">
                    <p className="text-xs text-muted-foreground mb-0.5">Age</p>
                    <p className="font-medium">
                      {decrypt(patient.encryptedAge) || "—"}
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-muted">
                    <p className="text-xs text-muted-foreground mb-0.5">
                      Emergency Phone
                    </p>
                    <p className="font-medium">
                      {patient.emergencyPhone || "—"}
                    </p>
                  </div>
                </div>
                <Link
                  to="/patients/$patientId"
                  params={{ patientId: patient.patientId }}
                >
                  <Button
                    data-ocid="qr_scanner.view_patient.button"
                    className="w-full"
                    style={{
                      background: "oklch(var(--primary))",
                      color: "white",
                    }}
                  >
                    View Full Record
                  </Button>
                </Link>
              </div>
            ) : (
              <div
                className="text-center py-6"
                data-ocid="qr_scanner.patient.error_state"
              >
                <p className="text-muted-foreground text-sm">
                  No patient found for this QR code.
                </p>
                <p className="font-mono text-xs mt-2 bg-muted px-3 py-1 rounded-lg inline-block">
                  {scannedId}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
