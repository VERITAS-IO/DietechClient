import { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "@/stores/auth-store";

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const { isAuthenticated } = useAuthStore();
  const location = useLocation();

  const publicPaths = ["/", "/login", "/register"];
  const isPublicPath = publicPaths.includes(location.pathname);

  if (!isAuthenticated && !isPublicPath) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (isAuthenticated && isPublicPath) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}