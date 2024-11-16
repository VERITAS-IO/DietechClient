import { Link } from "react-router-dom";
import { LoginForm } from "@/components/auth/login-form";
import { useTranslation } from "react-i18next";

export default function LoginPage() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <main className="flex-1">
        <div className="container flex items-center justify-center min-h-[calc(100vh-4rem)] px-4 sm:px-8">
          <div className="w-full max-w-[400px] space-y-6">
            <div className="text-center space-y-2">
              <h1 className="text-3xl font-bold">{t('auth.login.title')}</h1>
              <p className="text-muted-foreground">
                {t('auth.login.subtitle')}
              </p>
            </div>
            <LoginForm />
            <div className="space-y-4 text-center text-sm">
              <p className="text-muted-foreground">
                <Link
                  to="/forgot-password"
                  className="text-primary hover:underline font-medium"
                >
                  {t('auth.login.forgotPassword')}
                </Link>
              </p>
              <p className="text-muted-foreground">
                {t('auth.login.noAccount')}{" "}
                <Link
                  to="/register"
                  className="text-primary hover:underline font-medium"
                >
                  {t('auth.login.signUp')}
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}