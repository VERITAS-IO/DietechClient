import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useEffect } from "react";
import { useClientStore } from "@/stores/client-store";

const formSchema = z.object({
  userRegistrationRequest: z.object({
    firstName: z.string().min(2, "First name must be at least 2 characters").max(50, "First name must be less than 50 characters"),
    lastName: z.string().min(2, "Last name must be at least 2 characters").max(50, "Last name must be less than 50 characters"),
    email: z.string().email("Please enter a valid email address"),
    phoneNumber: z.string().min(10, "Phone number must be at least 10 digits").max(15, "Phone number must be less than 15 digits"),
    roles: z.array(z.string()).default(['Client']),
  }),
});

interface UserRegistrationFormProps {
  data?: z.infer<typeof formSchema>['userRegistrationRequest'];
  onSubmit: (data: z.infer<typeof formSchema>) => void;
  isSubmitting?: boolean;
}

export function UserRegistrationForm({ data, onSubmit, isSubmitting = false }: UserRegistrationFormProps) {
  const { formData } = useClientStore();
  
  const form = useForm({
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
  }, [data, formData.userRegistrationRequest, form]);

  return (
    <Form {...form}>
      <form 
        onSubmit={form.handleSubmit(onSubmit)} 
        className="space-y-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="userRegistrationRequest.firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input 
                    {...field} 
                    placeholder="Enter first name"
                    disabled={isSubmitting}
                    autoComplete="given-name"
                  />
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
                <FormLabel>Last Name</FormLabel>
                <FormControl>
                  <Input 
                    {...field} 
                    placeholder="Enter last name"
                    disabled={isSubmitting}
                    autoComplete="family-name"
                  />
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
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input 
                  type="email" 
                  {...field} 
                  placeholder="Enter email address"
                  disabled={isSubmitting}
                  autoComplete="email"
                />
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
              <FormLabel>Phone Number</FormLabel>
              <FormControl>
                <Input 
                  {...field} 
                  placeholder="Enter phone number"
                  disabled={isSubmitting}
                  autoComplete="tel"
                  type="tel"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button 
          type="submit" 
          className="w-full"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Creating..." : "Next"}
        </Button>
      </form>
    </Form>
  );
}
