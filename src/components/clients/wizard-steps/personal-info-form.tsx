import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect } from "react";
import { useClientStore } from "@/stores/client-store";

const formSchema = z.object({
  createPersonaInfoRequest: z.object({
    gender: z.enum(["Unknown", "Male", "Female", "Other"]),
    dateOfBirth: z.string(),
    firstName: z.string().min(2).max(50),
    lastName: z.string().min(2).max(50),
    email: z.string().email(),
    phoneNumber: z.string().min(10).max(15),
  }),
});

export function PersonalInfoForm({ data, onSubmit, isSubmitting = false }) {
  const { formData } = useClientStore();
  
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      createPersonaInfoRequest: {
        gender: "Unknown",
        dateOfBirth: "",
        firstName: formData.userRegistrationRequest.firstName,
        lastName: formData.userRegistrationRequest.lastName,
        email: formData.userRegistrationRequest.email,
        phoneNumber: formData.userRegistrationRequest.phoneNumber,
        ...data, 
      },
    },
  });

  useEffect(() => {
    const newData = {
      ...data,
      firstName: data?.firstName || formData.userRegistrationRequest.firstName,
      lastName: data?.lastName || formData.userRegistrationRequest.lastName,
      email: data?.email || formData.userRegistrationRequest.email,
      phoneNumber: data?.phoneNumber || formData.userRegistrationRequest.phoneNumber,
    };
    
    form.reset({
      createPersonaInfoRequest: newData,
    });
  }, [data, formData.userRegistrationRequest, form]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="createPersonaInfoRequest.firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="createPersonaInfoRequest.lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="createPersonaInfoRequest.gender"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Gender</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Unknown">Unknown</SelectItem>
                  <SelectItem value="Male">Male</SelectItem>
                  <SelectItem value="Female">Female</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="createPersonaInfoRequest.dateOfBirth"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date of Birth</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="createPersonaInfoRequest.email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="createPersonaInfoRequest.phoneNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone Number</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          Next
        </Button>
      </form>
    </Form>
  );
}