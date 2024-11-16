import { Link } from "react-router-dom";
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <main className="flex-1">
        <div className="container flex items-center justify-center min-h-[calc(100vh-4rem)] px-4 sm:px-8">
          <div className="w-full max-w-[400px] space-y-6">
            <Link to="/login">
              <Button type="button" className="mb-4 ">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Login
              </Button>
            </Link>
            <div className="text-center space-y-2">
              <h1 className="text-3xl font-bold">Reset Password</h1>
              <p className="text-muted-foreground">
                Enter your email address and we'll send you instructions to reset your password
              </p>
            </div>
            <ForgotPasswordForm />
          </div>
        </div>
      </main>
    </div>
  );
}