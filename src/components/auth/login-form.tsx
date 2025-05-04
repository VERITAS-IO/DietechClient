/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { authService } from "@/services/auth-service";
import { useAuthStore } from "@/stores/auth-store";
import { useTranslation } from "react-i18next";

const formSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export function LoginForm({ className, ...props }: React.ComponentPropsWithoutRef<"div">) {
  const { t } = useTranslation();

  const [showPassword, setShowPassword] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const setUser = useAuthStore((state) => state.setUser);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const loginMutation = useMutation({
    mutationFn: authService.login,
    onSuccess: (data) => {
      setUser(data);
      toast({
        title: t("auth.login.toast.success.title"),
        description: t("auth.login.toast.success.description"),
      });
      navigate("/");
    },
    onError: (error: any) => {
      toast({
        title: t("auth.login.toast.error.title"),
        description:
          error.response?.data?.detail ||
          t("auth.login.toast.error.description"),
        variant: "destructive",
      });
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>, e: React.FormEvent) {
    e.preventDefault();
    try {
      await loginMutation.mutateAsync(values);
    } catch (error) {
      console.error("Login error:", error);
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">{t('auth.login.title')}</CardTitle>
          <CardDescription>{t('auth.login.subtitle')}</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                form.handleSubmit((data) => onSubmit(data, e))(e);
              }}
              className="grid gap-6"
            >
              <div className="grid gap-6">
                <FormField
                  control={form.control}
                  disabled={loginMutation.isPending}  
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("auth.login.form.email.label")}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t("auth.login.form.email.placeholder")}
                          autoComplete="email"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  disabled={loginMutation.isPending}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center justify-between">
                        <FormLabel>{t("auth.login.form.password.label")}</FormLabel>
                        <Link
                          to="/forgot-password"
                          className="text-sm text-primary underline-offset-4 hover:underline"
                        >
                          {t('auth.login.forgotPassword')}
                        </Link>
                      </div>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showPassword ? "text" : "password"}
                            placeholder={t("auth.login.form.password.placeholder")}
                            autoComplete="current-password"
                            {...field}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            disabled={loginMutation.isPending}  
                            size="icon"
                            className="absolute right-2 top-1/2 -translate-y-1/2"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  className="w-full"
                  disabled={loginMutation.isPending}
                >
                  {loginMutation.isPending
                    ? t("auth.login.form.submit.loading")
                    : t("auth.login.form.submit.default")}
                </Button>
              </div>
              <div className="text-center text-sm">
                {t('auth.login.noAccount')}{" "}
                <Link to="/register" className="text-primary underline underline-offset-4">
                  {t('auth.login.signUp')}
                </Link>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
      <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-primary">
        {t('auth.login.termsAndPrivacy', { defaultValue: "By clicking continue, you agree to our " })}
        <a href="#">{t('auth.login.termsOfService', { defaultValue: "Terms of Service" })}</a>{" "}
        {t('auth.login.and', { defaultValue: "and" })}{" "}
        <a href="#">{t('auth.login.privacyPolicy', { defaultValue: "Privacy Policy" })}</a>.
      </div>
    </div>
  );
}
