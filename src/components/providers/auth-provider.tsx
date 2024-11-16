import { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "@/stores/auth-store";

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const { isAuthenticated } = useAuthStore();
  const location = useLocation();

  const publicPaths = ["/", "/login", "/register", "/confirm-email", "/forgot-password", "/reset-password"];
  
  const isPublicPath = publicPaths.includes(location.pathname);

  if (!isAuthenticated && !isPublicPath) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (isAuthenticated && isPublicPath && location.pathname !== "/" && location.pathname !== "/forgot-password") {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}