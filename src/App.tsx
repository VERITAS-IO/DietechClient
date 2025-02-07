import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import LandingPage from "@/pages/landing";
import LoginPage from "@/pages/auth/login";
import RegisterPage from "@/pages/auth/register";
import ForgotPasswordPage from "@/pages/auth/forgot-password";
import ResetPasswordPage from "@/pages/auth/reset-password";
import ConfirmEmailPage from "@/pages/auth/confirm-email";
import ClientListPage from "@/pages/nested/client-list";
import ClientDetailsPage from "@/pages/nested/client-details";
import Dashboard from "@/pages/dashboard";
import { useAuthStore } from "./stores/auth-store"; 
import DashboardLayout from "./layouts/DashboadLayouts";
import { Navbar } from "./components/common/navbar";
import AppointmentsCalendarPage from "./pages/nested/appointments";
import { AppointmentNotes } from "./components/appointments/AppointmentNotes";
import AppointmentNotesPage from "./pages/appointment/appointment-notes";

const queryClient = new QueryClient();

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated); 
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

function App() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated); 
  
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="system" storageKey="nutritrack-theme">
        <Router>
          <div className="min-h-screen flex flex-col">
            {!isAuthenticated && <Navbar />}
            <Routes>
              <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" /> : <LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/reset-password" element={<ResetPasswordPage />} />
              <Route path="/confirm-email" element={<ConfirmEmailPage />} />

              <Route
                path="/dashboard"
                element={
                  <PrivateRoute>
                    <DashboardLayout />
                  </PrivateRoute>
                }
              >
                <Route index element={<Dashboard />} />
                <Route path="schedule" element={<Navigate to="/dashboard" replace />} />
                
                <Route path="clients">
                  <Route index element={<ClientListPage />} />
                  <Route path=":id" element={<ClientDetailsPage />} />
                  <Route path="new" element={<Navigate to="/dashboard" replace />} />
                  <Route path="progress" element={<Navigate to="/dashboard" replace />} />
                </Route>

                <Route path="appointments">
                 <Route path="calendar" element={<AppointmentsCalendarPage />} />
                 <Route path="notes" element={<AppointmentNotesPage/>}  />
                </Route>

                <Route path="diet-plans/*" element={<Navigate to="/dashboard" replace />} />
                <Route path="analytics/*" element={<Navigate to="/dashboard" replace />} />
                <Route path="resources/*" element={<Navigate to="/dashboard" replace />} />
                <Route path="settings/*" element={<Navigate to="/dashboard" replace />} />
              </Route>
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </Router>
        <Toaster />
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;