import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import {
  ChevronRight,
  Heart,
  LayoutDashboard,
  Lock,
  Phone,
  QrCode,
  Scan,
  Shield,
  UserCheck,
} from "lucide-react";
import { motion } from "motion/react";

const features = [
  {
    icon: Shield,
    title: "Encrypted Records",
    description:
      "Patient data is encrypted end-to-end using military-grade XOR cipher with unique keys.",
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  {
    icon: QrCode,
    title: "QR Identity",
    description:
      "Each patient gets a unique QR code for instant identification — no paperwork needed.",
    color: "text-indigo-600",
    bg: "bg-indigo-50",
  },
  {
    icon: Phone,
    title: "Emergency Access",
    description:
      "One-tap emergency calls and instant patient record retrieval in critical situations.",
    color: "text-red-600",
    bg: "bg-red-50",
  },
  {
    icon: LayoutDashboard,
    title: "Smart Dashboard",
    description:
      "Real-time overview of all patients, recent activity, and blood type statistics.",
    color: "text-teal-600",
    bg: "bg-teal-50",
  },
];

const steps = [
  {
    icon: UserCheck,
    step: "01",
    title: "Register",
    description: "Create your account and set up your profile.",
  },
  {
    icon: QrCode,
    step: "02",
    title: "Generate QR",
    description: "Add patients and get unique QR codes instantly.",
  },
  {
    icon: Scan,
    step: "03",
    title: "Scan & Access",
    description: "Scan QR codes to view patient records in seconds.",
  },
  {
    icon: Phone,
    step: "04",
    title: "Emergency Call",
    description: "One-tap access to patient emergency contacts.",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-border">
        <div className="max-w-7xl mx-auto px-6 lg:px-16 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Heart className="w-6 h-6 text-red-500" fill="currentColor" />
            <span
              className="text-lg font-bold"
              style={{ color: "oklch(var(--primary))" }}
            >
              Aasha Health
            </span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a
              href="#features"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              data-ocid="landing.features.link"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              data-ocid="landing.how_it_works.link"
            >
              How it Works
            </a>
          </div>
          <Link to="/login" data-ocid="landing.login.button">
            <Button
              style={{ background: "oklch(var(--primary))", color: "white" }}
              className="rounded-full"
            >
              Login
            </Button>
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section
        className="pt-20 pb-24 px-6 lg:px-16"
        style={{
          background: "linear-gradient(135deg, #f3faff 0%, #ffffff 60%)",
        }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <div
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold"
                style={{ background: "#EAF4FF", color: "oklch(var(--accent))" }}
              >
                <Shield className="w-3 h-3" /> Secure · Encrypted · Reliable
              </div>
              <h1
                className="text-5xl lg:text-6xl font-bold leading-tight"
                style={{ color: "oklch(var(--foreground))" }}
              >
                Smart Patient Care,{" "}
                <span style={{ color: "oklch(var(--accent))" }}>
                  At Your Fingertips.
                </span>
              </h1>
              <p
                className="text-lg"
                style={{ color: "oklch(var(--muted-foreground))" }}
              >
                Aasha Health gives you encrypted patient records, QR-based
                identity, and one-tap emergency access — all in one secure
                platform.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link to="/login" data-ocid="landing.get_started.button">
                  <Button
                    size="lg"
                    className="rounded-full px-8"
                    style={{
                      background: "oklch(var(--primary))",
                      color: "white",
                    }}
                  >
                    Get Started <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
                <a href="#features" data-ocid="landing.learn_more.button">
                  <Button
                    size="lg"
                    variant="outline"
                    className="rounded-full px-8"
                    style={{
                      borderColor: "oklch(var(--primary))",
                      color: "oklch(var(--primary))",
                    }}
                  >
                    Learn More
                  </Button>
                </a>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex justify-center"
            >
              {/* Mobile mockup */}
              <div className="w-72 bg-white rounded-3xl shadow-2xl border border-border overflow-hidden">
                <div
                  className="h-8 flex items-center justify-center"
                  style={{ background: "oklch(var(--primary))" }}
                >
                  <div className="w-20 h-1.5 bg-white/40 rounded-full" />
                </div>
                <div className="p-6 space-y-4">
                  <div className="flex items-center gap-2">
                    <Heart
                      className="w-5 h-5 text-red-500"
                      fill="currentColor"
                    />
                    <span
                      className="font-bold text-sm"
                      style={{ color: "oklch(var(--primary))" }}
                    >
                      Aasha Health
                    </span>
                  </div>
                  <div
                    className="p-4 rounded-2xl text-center"
                    style={{ background: "#FEE2E2" }}
                  >
                    <Phone
                      className="w-8 h-8 text-red-600 mx-auto mb-2"
                      fill="currentColor"
                    />
                    <p className="text-sm font-bold text-red-700">
                      Emergency Call
                    </p>
                    <p className="text-xs text-red-500">Tap to call 112</p>
                  </div>
                  <div
                    className="p-4 rounded-2xl text-center"
                    style={{ background: "#EAF4FF" }}
                  >
                    <QrCode className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                    <p
                      className="text-sm font-bold"
                      style={{ color: "oklch(var(--primary))" }}
                    >
                      Scan QR Code
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Identify patient
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="p-3 rounded-xl bg-muted text-center">
                      <p
                        className="text-lg font-bold"
                        style={{ color: "oklch(var(--primary))" }}
                      >
                        24
                      </p>
                      <p className="text-xs text-muted-foreground">Patients</p>
                    </div>
                    <div className="p-3 rounded-xl bg-muted text-center">
                      <p className="text-lg font-bold text-green-600">Active</p>
                      <p className="text-xs text-muted-foreground">Status</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-6 lg:px-16">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <h2
              className="text-3xl font-bold mb-3"
              style={{ color: "oklch(var(--foreground))" }}
            >
              Everything You Need
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              A complete patient management system designed for modern
              healthcare.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-2xl p-6 border border-border shadow-sm hover:shadow-md transition-shadow"
              >
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${f.bg}`}
                >
                  <f.icon className={`w-6 h-6 ${f.color}`} />
                </div>
                <h3 className="font-bold text-foreground mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground">{f.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section
        id="how-it-works"
        className="py-20 px-6 lg:px-16"
        style={{ background: "#F3FAFF" }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <h2
              className="text-3xl font-bold mb-3"
              style={{ color: "oklch(var(--foreground))" }}
            >
              How Aasha Health Works
            </h2>
            <p className="text-muted-foreground">
              Get started in minutes with these simple steps.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((s, i) => (
              <motion.div
                key={s.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <div className="relative inline-block mb-4">
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto"
                    style={{ background: "oklch(var(--accent))" }}
                  >
                    <s.icon className="w-7 h-7 text-white" />
                  </div>
                  <span
                    className="absolute -top-2 -right-2 w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center text-white"
                    style={{ background: "oklch(var(--primary))" }}
                  >
                    {s.step}
                  </span>
                </div>
                <h3 className="font-bold text-foreground mb-2">{s.title}</h3>
                <p className="text-sm text-muted-foreground">{s.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section
        className="py-20 px-6 lg:px-16"
        style={{ background: "oklch(var(--primary))" }}
      >
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Transform Patient Care?
          </h2>
          <p className="text-white/70 mb-8">
            Join Aasha Health and bring encrypted, QR-powered patient management
            to your facility.
          </p>
          <Link to="/login" data-ocid="landing.cta_login.button">
            <Button
              size="lg"
              className="rounded-full px-10 bg-white font-semibold"
              style={{ color: "oklch(var(--primary))" }}
            >
              Start Now — It's Free
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 lg:px-16 border-t border-border">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-red-500" fill="currentColor" />
            <span
              className="font-bold"
              style={{ color: "oklch(var(--primary))" }}
            >
              Aasha Health
            </span>
          </div>
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()}. Built with ❤️ using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-foreground transition-colors"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
