import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useEffect } from "react";
import { useClientStore } from "@/stores/client-store";
import { useTranslation } from "react-i18next";

interface UserRegistrationFormProps {
  data?: any;
  onSubmit: (data: any) => void;
  isSubmitting?: boolean;
}

export function UserRegistrationForm({ data, onSubmit, isSubmitting = false }: UserRegistrationFormProps) {
  const { t } = useTranslation();
  const { formData } = useClientStore();
  
  const formSchema = z.object({
    userRegistrationRequest: z.object({
      firstName: z.string().min(2, t('auth.register.form.validation.firstName')).max(50, t('validation.maxLength', { max: 50 })),
      lastName: z.string().min(2, t('auth.register.form.validation.lastName')).max(50, t('validation.maxLength', { max: 50 })),
      email: z.string().email(t('validation.email')),
      phoneNumber: z.string().min(10, t('validation.minLength', { min: 10 })).max(15, t('validation.maxLength', { max: 15 })),
      roles: z.array(z.string()).default(['Client']),
    }),
  });

  type FormValues = z.infer<typeof formSchema>;
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      userRegistrationRequest: {
        firstName: formData.userRegistrationRequest.firstName,
        lastName: formData.userRegistrationRequest.lastName,
        email: formData.userRegistrationRequest.email,
        phoneNumber: formData.userRegistrationRequest.phoneNumber,
        roles: formData.userRegistrationRequest.roles,
        ...data,
      },
    },
  });

  useEffect(() => {
    const newData = {
      firstName: data?.firstName || formData.userRegistrationRequest.firstName,
      lastName: data?.lastName || formData.userRegistrationRequest.lastName,
      email: data?.email || formData.userRegistrationRequest.email,
      phoneNumber: data?.phoneNumber || formData.userRegistrationRequest.phoneNumber,
      roles: data?.roles || formData.userRegistrationRequest.roles,
    };

    form.reset({
      userRegistrationRequest: newData,
    });
  }, [data, form, formData.userRegistrationRequest]);

  const handleSubmit = (values: FormValues) => {
    onSubmit(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="userRegistrationRequest.firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('auth.register.form.firstName.label')}</FormLabel>
                <FormControl>
                  <Input placeholder={t('auth.register.form.firstName.placeholder')} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="userRegistrationRequest.lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('auth.register.form.lastName.label')}</FormLabel>
                <FormControl>
                  <Input placeholder={t('auth.register.form.lastName.placeholder')} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="userRegistrationRequest.email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('auth.register.form.email.label')}</FormLabel>
              <FormControl>
                <Input placeholder={t('auth.register.form.email.placeholder')} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="userRegistrationRequest.phoneNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('auth.register.form.phoneNumber.label')}</FormLabel>
              <FormControl>
                <Input placeholder={t('auth.register.form.phoneNumber.placeholder')} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? t('common.saving') : t('client.wizard.next')}
          </Button>
        </div>
      </form>
    </Form>
  );
}
