import { Button } from "@/components/ui/button";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { Heart, Loader2, Shield } from "lucide-react";
import { useEffect } from "react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

export default function LoginPage() {
  const { login, clear, loginStatus, identity } = useInternetIdentity();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const isAuthenticated = !!identity;
  const isLoggingIn = loginStatus === "logging-in";

  useEffect(() => {
    if (isAuthenticated) {
      navigate({ to: "/dashboard" });
    }
  }, [isAuthenticated, navigate]);

  const handleAuth = async () => {
    if (isAuthenticated) {
      await clear();
      queryClient.clear();
      navigate({ to: "/" });
    } else {
      try {
        await login();
      } catch (error: any) {
        console.error("Login error:", error);
        if (error.message === "User is already authenticated") {
          await clear();
          setTimeout(() => login(), 300);
        }
      }
    }
  };

  return (
    <div
      className="min-h-screen flex"
      style={{
        background: "linear-gradient(135deg, #EAF5FF 0%, #FFFFFF 100%)",
      }}
    >
      {/* Left branding panel */}
      <div
        className="hidden lg:flex flex-col justify-center px-16 w-1/2"
        style={{ background: "oklch(var(--primary))" }}
      >
        <div className="max-w-md">
          <div className="flex items-center gap-3 mb-12">
            <Heart className="w-8 h-8 text-red-400" fill="currentColor" />
            <span className="text-2xl font-bold text-white">Aasha Health</span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-4 leading-tight">
            Secure Patient Management For Modern Healthcare
          </h1>
          <p className="text-white/70 text-lg">
            Encrypted records, QR identities, and instant emergency access — all
            secured on the blockchain.
          </p>
          <div className="mt-10 grid grid-cols-2 gap-4">
            {[
              "End-to-End Encryption",
              "QR Patient IDs",
              "Emergency Calls",
              "Role-Based Access",
            ].map((f) => (
              <div
                key={f}
                className="flex items-center gap-2 text-white/80 text-sm"
              >
                <Shield className="w-4 h-4 text-blue-300 flex-shrink-0" />
                {f}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right login panel */}
      <div className="flex-1 flex items-center justify-center px-6">
        <div className="w-full max-w-sm space-y-8">
          <div className="text-center">
            <div className="lg:hidden flex items-center justify-center gap-2 mb-6">
              <Heart className="w-7 h-7 text-red-500" fill="currentColor" />
              <span
                className="text-xl font-bold"
                style={{ color: "oklch(var(--primary))" }}
              >
                Aasha Health
              </span>
            </div>
            <h2 className="text-3xl font-bold text-foreground">Welcome Back</h2>
            <p className="text-muted-foreground mt-2">
              Sign in to access patient records securely.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-lg border border-border space-y-6">
            <div className="text-center">
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
                style={{ background: "#EAF4FF" }}
              >
                <Shield
                  className="w-8 h-8"
                  style={{ color: "oklch(var(--accent))" }}
                />
              </div>
              <p className="text-sm text-muted-foreground">
                Aasha Health uses Internet Identity for secure, passwordless
                authentication. Your data is always encrypted and private.
              </p>
            </div>

            <Button
              data-ocid="login.submit_button"
              onClick={handleAuth}
              disabled={isLoggingIn}
              className="w-full h-12 rounded-xl font-semibold text-base"
              style={{ background: "oklch(var(--primary))", color: "white" }}
            >
              {isLoggingIn ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Signing
                  in...
                </>
              ) : isAuthenticated ? (
                "Sign Out"
              ) : (
                "Sign In Securely"
              )}
            </Button>

            <p className="text-xs text-center text-muted-foreground">
              Secured by Internet Identity — no passwords stored.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
