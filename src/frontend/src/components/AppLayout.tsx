import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useQueryClient } from "@tanstack/react-query";
import {
  Link,
  Outlet,
  useNavigate,
  useRouterState,
} from "@tanstack/react-router";
import {
  Heart,
  LayoutDashboard,
  LogOut,
  Menu,
  Phone,
  QrCode,
  UserPlus,
  Users,
  X,
} from "lucide-react";
import { useState } from "react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useGetCallerUserProfile,
  useSaveCallerUserProfile,
} from "../hooks/useQueries";

const navItems = [
  {
    path: "/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    ocid: "nav.dashboard.link",
  },
  {
    path: "/patients",
    label: "Patients",
    icon: Users,
    ocid: "nav.patients.link",
  },
  {
    path: "/patients/add",
    label: "Add Patient",
    icon: UserPlus,
    ocid: "nav.add_patient.link",
  },
  { path: "/scan", label: "Scan QR", icon: QrCode, ocid: "nav.scan.link" },
  {
    path: "/emergency",
    label: "Emergency",
    icon: Phone,
    ocid: "nav.emergency.link",
  },
];

export default function AppLayout() {
  const { identity, clear } = useInternetIdentity();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  const {
    data: profile,
    isLoading: profileLoading,
    isFetched,
  } = useGetCallerUserProfile();
  const saveProfile = useSaveCallerUserProfile();

  const [profileName, setProfileName] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isAuthenticated = !!identity;
  const showProfileSetup =
    isAuthenticated && !profileLoading && isFetched && profile === null;

  const handleLogout = async () => {
    await clear();
    queryClient.clear();
    navigate({ to: "/" });
  };

  const handleSaveProfile = async () => {
    if (!profileName.trim()) return;
    await saveProfile.mutateAsync({ name: profileName.trim() });
  };

  if (!isAuthenticated) {
    navigate({ to: "/login" });
    return null;
  }

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div
        className="flex items-center gap-2 px-4 py-5 border-b"
        style={{ borderColor: "oklch(var(--sidebar-border))" }}
      >
        <Heart className="w-6 h-6 text-red-400" fill="currentColor" />
        <span className="text-lg font-bold text-white">Aasha Health</span>
      </div>
      <nav className="flex-1 p-3 space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            data-ocid={item.ocid}
            className={`sidebar-nav-item ${currentPath === item.path || (item.path === "/patients" && currentPath.startsWith("/patients") && !currentPath.includes("/add")) ? "active" : ""}`}
            onClick={() => setSidebarOpen(false)}
          >
            <item.icon className="w-4 h-4" />
            {item.label}
          </Link>
        ))}
      </nav>
      <div
        className="p-3 border-t"
        style={{ borderColor: "oklch(var(--sidebar-border))" }}
      >
        <button
          type="button"
          onClick={handleLogout}
          data-ocid="nav.logout.button"
          className="sidebar-nav-item w-full text-red-300 hover:text-red-200"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-muted overflow-hidden">
      <aside
        className="hidden md:flex flex-col w-64 flex-shrink-0"
        style={{ background: "oklch(var(--sidebar))" }}
      >
        <SidebarContent />
      </aside>

      {sidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setSidebarOpen(false)}
            onKeyDown={(e) => e.key === "Escape" && setSidebarOpen(false)}
            role="button"
            tabIndex={0}
            aria-label="Close sidebar"
          />
          <aside
            className="absolute left-0 top-0 h-full w-64 flex flex-col"
            style={{ background: "oklch(var(--sidebar))" }}
          >
            <div className="flex justify-end p-3">
              <button
                type="button"
                onClick={() => setSidebarOpen(false)}
                className="text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <SidebarContent />
          </aside>
        </div>
      )}

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b border-border h-14 flex items-center px-4 gap-4 flex-shrink-0">
          <button
            type="button"
            className="md:hidden p-1"
            onClick={() => setSidebarOpen(true)}
            data-ocid="nav.menu.button"
          >
            <Menu className="w-5 h-5 text-foreground" />
          </button>
          <div className="flex-1" />
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold"
              style={{ background: "oklch(var(--accent))" }}
            >
              {profile?.name?.charAt(0)?.toUpperCase() || "U"}
            </div>
            <span className="text-sm font-medium text-foreground hidden sm:block">
              {profile?.name || "User"}
            </span>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <Outlet />
        </main>
      </div>

      <Dialog open={showProfileSetup}>
        <DialogContent data-ocid="profile_setup.dialog" className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Welcome to Aasha Health!</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Please enter your name to set up your profile.
          </p>
          <div className="space-y-2">
            <Label htmlFor="profile-name">Your Name</Label>
            <Input
              id="profile-name"
              data-ocid="profile_setup.input"
              placeholder="Enter your full name"
              value={profileName}
              onChange={(e) => setProfileName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSaveProfile()}
            />
          </div>
          <Button
            data-ocid="profile_setup.submit_button"
            onClick={handleSaveProfile}
            disabled={!profileName.trim() || saveProfile.isPending}
            className="w-full"
            style={{
              background: "oklch(var(--primary))",
              color: "oklch(var(--primary-foreground))",
            }}
          >
            {saveProfile.isPending ? "Saving..." : "Save Profile"}
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
