import { Toaster } from "@/components/ui/sonner";
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
  redirect,
} from "@tanstack/react-router";
import AppLayout from "./components/AppLayout";
import { useInternetIdentity } from "./hooks/useInternetIdentity";
import AddPatientPage from "./pages/AddPatientPage";
import DashboardPage from "./pages/DashboardPage";
import EmergencyPage from "./pages/EmergencyPage";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import PatientDetailPage from "./pages/PatientDetailPage";
import PatientsPage from "./pages/PatientsPage";
import QRScannerPage from "./pages/QRScannerPage";

// Root component
function Root() {
  return (
    <>
      <Outlet />
      <Toaster />
    </>
  );
}

const rootRoute = createRootRoute({ component: Root });

const landingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: LandingPage,
});

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/login",
  component: LoginPage,
});

const appLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: "app",
  component: AppLayout,
});

const dashboardRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: "/dashboard",
  component: DashboardPage,
});

const patientsRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: "/patients",
  component: PatientsPage,
});

const addPatientRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: "/patients/add",
  component: AddPatientPage,
});

const patientDetailRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: "/patients/$patientId",
  component: PatientDetailPage,
});

const editPatientRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: "/patients/$patientId/edit",
  component: () => <AddPatientPage editMode />,
});

const qrScannerRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: "/scan",
  component: QRScannerPage,
});

const emergencyRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: "/emergency",
  component: EmergencyPage,
});

const routeTree = rootRoute.addChildren([
  landingRoute,
  loginRoute,
  appLayoutRoute.addChildren([
    dashboardRoute,
    patientsRoute,
    addPatientRoute,
    patientDetailRoute,
    editPatientRoute,
    qrScannerRoute,
    emergencyRoute,
  ]),
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
