import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Link } from "@tanstack/react-router";
import { AlertTriangle, ChevronRight, Phone, Search } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { useListPatients } from "../hooks/useQueries";
import { decrypt } from "../lib/encryption";

export default function EmergencyPage() {
  const { data: patients = [] } = useListPatients();
  const [search, setSearch] = useState("");

  const filtered = patients.filter(
    (p) =>
      decrypt(p.encryptedName).toLowerCase().includes(search.toLowerCase()) ||
      p.patientId.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="max-w-2xl mx-auto space-y-6" data-ocid="emergency.page">
      <div>
        <h1 className="text-2xl font-bold text-red-700">Emergency Access</h1>
        <p className="text-sm text-muted-foreground">
          Quickly call emergency services or patient contacts.
        </p>
      </div>

      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Card style={{ background: "#FEF2F2", borderColor: "#FECACA" }}>
          <CardContent className="pt-6 pb-6">
            <div className="text-center space-y-4">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto"
                style={{ background: "#FEE2E2" }}
              >
                <AlertTriangle className="w-8 h-8 text-red-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-red-800">
                  Emergency Services
                </h2>
                <p className="text-red-600 text-sm">
                  Call national emergency number
                </p>
              </div>
              <a href="tel:112" data-ocid="emergency.call_112.button">
                <button
                  type="button"
                  className="w-full sm:w-auto px-12 py-4 rounded-2xl text-white font-bold text-xl shadow-lg hover:shadow-xl active:scale-95 transition-all"
                  style={{ background: "#DC2626" }}
                >
                  <Phone className="inline w-6 h-6 mr-3" fill="currentColor" />
                  Call 112
                </button>
              </a>
              <p className="text-xs text-red-400">
                Tap to dial emergency services immediately
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {[
          { label: "Ambulance", number: "108" },
          { label: "Police", number: "100" },
          { label: "Fire", number: "101" },
        ].map((s) => (
          <a
            key={s.number}
            href={`tel:${s.number}`}
            data-ocid={`emergency.${s.label.toLowerCase()}.button`}
          >
            <Card
              className="hover:shadow-md transition-shadow cursor-pointer"
              style={{ borderColor: "#FEE2E2" }}
            >
              <CardContent className="pt-4 pb-4 text-center">
                <Phone className="w-5 h-5 text-red-500 mx-auto mb-2" />
                <p className="font-bold text-foreground">{s.number}</p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </CardContent>
            </Card>
          </a>
        ))}
      </div>

      <Card className="border-border">
        <CardHeader>
          <CardTitle className="text-base">
            Patient Emergency Contacts
          </CardTitle>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              data-ocid="emergency.search_input"
              placeholder="Search patients…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 mt-2"
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {filtered.length === 0 ? (
            <div
              className="text-center py-8 text-muted-foreground text-sm"
              data-ocid="emergency.contacts.empty_state"
            >
              No patients found.
            </div>
          ) : (
            <div className="divide-y divide-border">
              {filtered.map((p, idx) => (
                <div
                  key={p.patientId}
                  data-ocid={`emergency.contacts.item.${idx + 1}`}
                  className="flex items-center gap-3 px-4 py-3"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {decrypt(p.encryptedName)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {decrypt(p.encryptedEmergencyContact) ||
                        "No contact name"}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {p.emergencyPhone && (
                      <a
                        href={`tel:${p.emergencyPhone}`}
                        data-ocid={`emergency.call.button.${idx + 1}`}
                      >
                        <button
                          type="button"
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white"
                          style={{ background: "#DC2626" }}
                        >
                          <Phone className="w-3 h-3" /> {p.emergencyPhone}
                        </button>
                      </a>
                    )}
                    <Link
                      to="/patients/$patientId"
                      params={{ patientId: p.patientId }}
                    >
                      <button
                        type="button"
                        className="p-1.5 rounded-lg hover:bg-muted"
                        data-ocid={`emergency.view.button.${idx + 1}`}
                      >
                        <ChevronRight className="w-4 h-4 text-muted-foreground" />
                      </button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
