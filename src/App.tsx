import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import LandingPage from "@/pages/landing";
import LoginPage from "@/pages/auth/login";
import RegisterPage from "@/pages/auth/register";
import ClientListPage from "./pages/client-list";
import ClientDetailsPage from "./pages/client-details";
import { Navbar } from "./components/common/navbar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./components/providers/auth-provider";
import ConfirmEmailPage from "./pages/auth/confirm-email";
import ForgotPasswordPage from "./pages/auth/forgot-password";
import ResetPasswordPage from "./pages/auth/reset-password";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="system" storageKey="nutritrack-theme">
        <Router>
          <AuthProvider>
            <div className="min-h-screen flex flex-col">
              <Navbar />
              <div className="flex-1 flex flex-col">
                <Routes>
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                  <Route path="/reset-password" element={<ResetPasswordPage />} />
                  <Route path="/confirm-email" element={<ConfirmEmailPage />} />
                  <Route path="/client-list" element={<ClientListPage />} />
                  <Route path="/clients/:id" element={<ClientDetailsPage />} />
                </Routes>
              </div>
            </div>
          </AuthProvider>
        </Router>
        <Toaster />
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
