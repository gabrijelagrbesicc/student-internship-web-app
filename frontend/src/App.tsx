import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import NewApplicationPage from "./pages/NewApplicationPage";
import MyApplicationsPage from "./pages/MyApplicationsPage";
import AllApplicationsPage from "./pages/AllApplicationsPage";
import ApplicationDetailsPage from "./pages/ApplicationDetailsPage";
import ReportsPage from "./pages/ReportsPage";
import NotificationsPage from "./pages/NotificationsPage";
import InstitutionsPage from "./pages/InstitutionsPage";
import ProtectedRoute from "./routes/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/applications/new"
          element={
            <ProtectedRoute allowedRoles={["student"]}>
              <NewApplicationPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/applications/my"
          element={
            <ProtectedRoute allowedRoles={["student"]}>
              <MyApplicationsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/applications/all"
          element={
            <ProtectedRoute allowedRoles={["mentor", "admin"]}>
              <AllApplicationsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/reports"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <ReportsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/notifications"
          element={
            <ProtectedRoute>
              <NotificationsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/institutions"
          element={
            <ProtectedRoute allowedRoles={["mentor", "admin"]}>
              <InstitutionsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/applications/:id"
          element={
            <ProtectedRoute>
              <ApplicationDetailsPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;