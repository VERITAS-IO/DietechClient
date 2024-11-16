import { Link } from "react-router-dom";
import { RegisterForm } from "@/components/auth/register-form";
import { useTranslation } from "react-i18next";

export default function RegisterPage() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <main className="flex-1">
        <div className="container flex items-center justify-center min-h-[calc(100vh-4rem)] px-4 sm:px-8">
          <div className="w-full max-w-[400px] space-y-6">
            <div className="text-center space-y-2">
              <h1 className="text-3xl font-bold">{t('auth.register.title')}</h1>
              <p className="text-muted-foreground">
                {t('auth.register.subtitle')}
              </p>
            </div>
            <RegisterForm />
            <p className="text-center text-sm text-muted-foreground">
              {t('auth.register.haveAccount')}{" "}
              <Link
                to="/login"
                className="text-primary hover:underline font-medium"
              >
                {t('auth.register.signIn')}
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}