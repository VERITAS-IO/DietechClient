import { Link } from "react-router-dom";
import { LoginForm } from "@/components/auth/login-form";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <main className="flex-1">
        <div className="container flex items-center justify-center min-h-[calc(100vh-4rem)] px-4 sm:px-8">
          <div className="w-full max-w-[400px] space-y-6">
            <div className="text-center space-y-2">
              <h1 className="text-3xl font-bold">Welcome back</h1>
              <p className="text-muted-foreground">
                Enter your credentials to access your account
              </p>
            </div>
            <LoginForm />
            <div className="space-y-4 text-center text-sm">
              <p className="text-muted-foreground">
                <Link
                  to="/forgot-password"
                  className="text-primary hover:underline font-medium"
                >
                  Forgot your password?
                </Link>
              </p>
              <p className="text-muted-foreground">
                Don't have an account?{" "}
                <Link
                  to="/register"
                  className="text-primary hover:underline font-medium"
                >
                  Sign up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}