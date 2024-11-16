/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { authService } from "@/services/auth-service";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export function RegisterForm() {
  const { t } = useTranslation();

  const formSchema = z
    .object({
      firstName: z
        .string()
        .min(2, t("auth.register.form.validation.firstName")),
      lastName: z.string().min(2, t("auth.register.form.validation.lastName")),
      userName: z
        .string()
        .min(3, t("auth.register.form.validation.userName.min"))
        .regex(
          /^[a-zA-Z0-9_-]+$/,
          t("auth.register.form.validation.userName.pattern")
        ),
      email: z.string().email(t("auth.register.form.validation.email")),
      password: z
        .string()
        .min(6, t("auth.register.form.validation.password.min"))
        .regex(/[A-Z]/, t("auth.register.form.validation.password.uppercase"))
        .regex(/[a-z]/, t("auth.register.form.validation.password.lowercase"))
        .regex(/[0-9]/, t("auth.register.form.validation.password.number")),
      confirmPassword: z.string(),
      phoneNumber: z
        .string()
        .regex(
          /^\+?[1-9]\d{1,14}$/,
          t("auth.register.form.validation.phoneNumber")
        )
        .optional()
        .or(z.literal("")),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: t("auth.register.form.validation.passwordMatch"),
      path: ["confirmPassword"],
    });

  type FormValues = z.infer<typeof formSchema>;

  const [showPassword, setShowPassword] = useState(false);
  const [passwordMatchStatus, setPasswordMatchStatus] = useState<
    "idle" | "matching" | "not-matching"
  >("idle");
  const { toast } = useToast();
  const navigate = useNavigate();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      userName: "",
      email: "",
      password: "",
      confirmPassword: "",
      phoneNumber: "",
    },
    mode: "onChange",
  });

  const password = form.watch("password");
  const confirmPassword = form.watch("confirmPassword");

  useEffect(() => {
    if (confirmPassword) {
      if (password === confirmPassword) {
        setPasswordMatchStatus("matching");
      } else {
        setPasswordMatchStatus("not-matching");
      }
    } else {
      setPasswordMatchStatus("idle");
    }
  }, [password, confirmPassword]);

  const registerMutation = useMutation({
    mutationFn: (data: Omit<FormValues, "confirmPassword">) => {
      const registrationData = {
        ...data,
        roles: ["user"],
      };
      return authService.register(registrationData);
    },
    onSuccess: () => {
      toast({
        title: t("auth.register.toast.success.title"),
        description: t("auth.register.toast.success.description"),
      });
      navigate("/login");
    },
    onError: (error: Error) => {
      toast({
        title: t("auth.register.toast.error.title"),
        description:
          error.message || t("auth.register.toast.error.description"),
        variant: "destructive",
      });
    },
  });

  const { isPending } = registerMutation;

  async function onSubmit(values: FormValues, e: React.FormEvent) {
    e?.preventDefault();
    const { confirmPassword, ...registrationData } = values;
    try {
      await registerMutation.mutateAsync(registrationData);
    } catch (error) {
      console.error("Registration error:", error);
    }
  }

  const getPasswordMatchColor = () => {
    switch (passwordMatchStatus) {
      case "matching":
        return "text-green-600";
      case "not-matching":
        return "text-red-600";
      default:
        return "";
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit((data) => onSubmit(data, e))(e);
        }}
        className="space-y-4"
      >
        <div className="grid grid-cols-2 gap-4">
          <FormField
            disabled={isPending}
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("auth.register.form.firstName.label")}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={t("auth.register.form.firstName.placeholder")}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            disabled={isPending}
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("auth.register.form.lastName.label")}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={t("auth.register.form.lastName.placeholder")}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          disabled={isPending}
          control={form.control}
          name="userName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("auth.register.form.userName.label")}</FormLabel>
              <FormControl>
                <Input
                  placeholder={t("auth.register.form.userName.placeholder")}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          disabled={isPending}
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("auth.register.form.email.label")}</FormLabel>
              <FormControl>
                <Input
                  placeholder={t("auth.register.form.email.placeholder")}
                  autoComplete="email"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          disabled={isPending}
          control={form.control}
          name="phoneNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("auth.register.form.phoneNumber.label")}</FormLabel>
              <FormControl>
                <Input
                  placeholder={t("auth.register.form.phoneNumber.placeholder")}
                  type="tel"
                  autoComplete="tel"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          disabled={isPending}
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("auth.register.form.password.label")}</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder={t("auth.register.form.password.placeholder")}
                    autoComplete="new-password"
                    {...field}
                  />
                  <Button
                    type="button"
                    variant="ghost"
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

        <FormField
          disabled={isPending}
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {t("auth.register.form.confirmPassword.label")}
              </FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder={t(
                      "auth.register.form.confirmPassword.placeholder"
                    )}
                    autoComplete="new-password"
                    {...field}
                  />
                  {confirmPassword && (
                    <div className={`text-sm mt-1 ${getPasswordMatchColor()}`}>
                      {passwordMatchStatus === "matching"
                        ? t("auth.register.form.confirmPassword.matching")
                        : t("auth.register.form.confirmPassword.notMatching")}
                    </div>
                  )}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="w-full"
          disabled={
            registerMutation.isPending || passwordMatchStatus === "not-matching"
          }
        >
          {registerMutation.isPending
            ? t("auth.register.form.submit.loading")
            : t("auth.register.form.submit.default")}
        </Button>
      </form>
    </Form>
  );
}

export default RegisterForm;
