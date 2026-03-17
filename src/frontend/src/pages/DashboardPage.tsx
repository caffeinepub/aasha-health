import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "@tanstack/react-router";
import {
  Droplet,
  Loader2,
  Phone,
  QrCode,
  TrendingUp,
  UserPlus,
  Users,
} from "lucide-react";
import { useListPatients } from "../hooks/useQueries";
import { decrypt } from "../lib/encryption";

const BLOOD_TYPES = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

export default function DashboardPage() {
  const { data: patients = [], isLoading } = useListPatients();

  const now = Date.now();
  const sevenDaysAgo = now - 7 * 24 * 60 * 60 * 1000;
  const recentPatients = patients.filter(
    (p) => Number(p.createdAt) / 1_000_000 > sevenDaysAgo,
  );

  const bloodTypeCounts = BLOOD_TYPES.reduce(
    (acc, bt) => {
      acc[bt] = patients.filter((p) => p.bloodType === bt).length;
      return acc;
    },
    {} as Record<string, number>,
  );

  const lastFive = [...patients].slice(-5).reverse();

  return (
    <div className="space-y-6" data-ocid="dashboard.page">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground text-sm">
          Overview of patient records and quick actions.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border-border">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Patients</p>
                <p className="text-3xl font-bold text-foreground mt-1">
                  {isLoading ? (
                    <Loader2 className="w-6 h-6 animate-spin" />
                  ) : (
                    patients.length
                  )}
                </p>
              </div>
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{ background: "#EAF4FF" }}
              >
                <Users
                  className="w-6 h-6"
                  style={{ color: "oklch(var(--accent))" }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Last 7 Days</p>
                <p className="text-3xl font-bold text-foreground mt-1">
                  {isLoading ? (
                    <Loader2 className="w-6 h-6 animate-spin" />
                  ) : (
                    recentPatients.length
                  )}
                </p>
              </div>
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{ background: "#F0FDF4" }}
              >
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Blood Types</p>
                <p className="text-3xl font-bold text-foreground mt-1">
                  {Object.values(bloodTypeCounts).filter((c) => c > 0).length}
                </p>
              </div>
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{ background: "#FEF2F2" }}
              >
                <Droplet className="w-6 h-6 text-red-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="text-base">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Link to="/patients/add">
              <Button
                data-ocid="dashboard.add_patient.button"
                style={{ background: "oklch(var(--primary))", color: "white" }}
              >
                <UserPlus className="w-4 h-4 mr-2" /> Add Patient
              </Button>
            </Link>
            <Link to="/scan">
              <Button data-ocid="dashboard.scan_qr.button" variant="outline">
                <QrCode className="w-4 h-4 mr-2" /> Scan QR Code
              </Button>
            </Link>
            <Link to="/emergency">
              <Button
                data-ocid="dashboard.emergency.button"
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                <Phone className="w-4 h-4 mr-2" /> Emergency Call
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Recent Patients */}
      <Card className="border-border">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base">Recent Patients</CardTitle>
          <Link
            to="/patients"
            className="text-sm font-medium"
            style={{ color: "oklch(var(--accent))" }}
            data-ocid="dashboard.view_all.link"
          >
            View All
          </Link>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div
              className="flex items-center justify-center py-8"
              data-ocid="dashboard.patients.loading_state"
            >
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
          ) : lastFive.length === 0 ? (
            <div
              className="text-center py-10 text-muted-foreground"
              data-ocid="dashboard.patients.empty_state"
            >
              <Users className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p className="text-sm">
                No patients yet. Add your first patient to get started.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {lastFive.map((p, idx) => (
                <Link
                  key={p.patientId}
                  to="/patients/$patientId"
                  params={{ patientId: p.patientId }}
                  data-ocid={`dashboard.patients.item.${idx + 1}`}
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-muted transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold"
                      style={{ background: "oklch(var(--accent))" }}
                    >
                      {decrypt(p.encryptedName)?.charAt(0)?.toUpperCase() ||
                        "P"}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {decrypt(p.encryptedName) || "Unknown"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        ID: {p.patientId.slice(0, 8)}…
                      </p>
                    </div>
                  </div>
                  <Badge variant="outline">{p.bloodType}</Badge>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Blood Type Distribution */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="text-base">Blood Type Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-3">
            {BLOOD_TYPES.map((bt) => (
              <div
                key={bt}
                className="text-center p-3 rounded-xl"
                style={{
                  background:
                    bloodTypeCounts[bt] > 0 ? "#FEF2F2" : "oklch(var(--muted))",
                }}
              >
                <p
                  className="text-lg font-bold"
                  style={{
                    color:
                      bloodTypeCounts[bt] > 0
                        ? "#DC2626"
                        : "oklch(var(--muted-foreground))",
                  }}
                >
                  {bloodTypeCounts[bt]}
                </p>
                <p className="text-xs font-medium text-muted-foreground">
                  {bt}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
