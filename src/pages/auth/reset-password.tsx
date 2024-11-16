// src/pages/reset-password.tsx
import { useSearchParams } from "react-router-dom";
import { ResetPasswordForm } from "@/components/auth/reset-password-form";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function ResetPasswordPage() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email") || "";
  const token = searchParams.get("token") || "";

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <main className="flex-1">
        <div className="container flex items-center justify-center min-h-[calc(100vh-4rem)] px-4 sm:px-8">
          <div className="w-full max-w-[400px] space-y-6">
            <Link to="/login">
              <Button variant="ghost" className="mb-4">
                <ArrowLeft className="mr-2 h-4 w-4" />
                {t("auth.resetPassword.backToLogin")}
              </Button>
            </Link>
            <div className="text-center space-y-2">
              <h1 className="text-3xl font-bold">{t("auth.resetPassword.title")}</h1>
              <p className="text-muted-foreground">
                {t("auth.resetPassword.subtitle")}
              </p>
            </div>
            <ResetPasswordForm email={email} resetCode={token} />
          </div>
        </div>
      </main>
    </div>
  );
}
