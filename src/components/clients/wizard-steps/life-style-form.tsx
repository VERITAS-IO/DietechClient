import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useEffect } from "react";
import { useClientStore } from "@/stores/client-store";

const formSchema = z.object({
  createLifeStyleInfoRequest: z.object({
    physicalActivity: z.enum(["Unknown", "None", "Light", "Moderate", "Active", "VeryActive"]),
    sleepHours: z.string().transform(Number),
    stressLevel: z.enum(["Unknown", "Low", "Moderate", "High", "VeryHigh"]),
    smoking: z.enum(["Unknown", "None", "Occasional", "Regular", "Heavy"]),
    alcohol: z.enum(["Unknown", "None", "Occasional", "Regular", "Heavy"]),
  }),
});

export function LifeStyleForm({ data, onSubmit }) {
  const { formData } = useClientStore();
  
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      createLifeStyleInfoRequest: {
        physicalActivity: formData.createLifeStyleInfoRequest.physicalActivity,
        sleepHours: formData.createLifeStyleInfoRequest.sleepHours.toString(),
        stressLevel: formData.createLifeStyleInfoRequest.stressLevel,
        smoking: formData.createLifeStyleInfoRequest.smoking,
        alcohol: formData.createLifeStyleInfoRequest.alcohol,
        ...data,
      },
    },
  });

  useEffect(() => {
    const newData = {
      ...data,
      physicalActivity: data?.physicalActivity || formData.createLifeStyleInfoRequest.physicalActivity,
      sleepHours: (data?.sleepHours || formData.createLifeStyleInfoRequest.sleepHours).toString(),
      stressLevel: data?.stressLevel || formData.createLifeStyleInfoRequest.stressLevel,
      smoking: data?.smoking || formData.createLifeStyleInfoRequest.smoking,
      alcohol: data?.alcohol || formData.createLifeStyleInfoRequest.alcohol,
    };
    
    form.reset({
      createLifeStyleInfoRequest: newData,
    });
  }, [data, formData.createLifeStyleInfoRequest, form]);


  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="createLifeStyleInfoRequest.physicalActivity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Physical Activity Level</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select activity level" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Unknown">Unknown</SelectItem>
                  <SelectItem value="None">None</SelectItem>
                  <SelectItem value="Light">Light</SelectItem>
                  <SelectItem value="Moderate">Moderate</SelectItem>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="VeryActive">Very Active</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="createLifeStyleInfoRequest.sleepHours"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Sleep Hours</FormLabel>
              <FormControl>
                <Input type="number" step="0.5" min="0" max="24" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="createLifeStyleInfoRequest.stressLevel"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Stress Level</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select stress level" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Unknown">Unknown</SelectItem>
                  <SelectItem value="Low">Low</SelectItem>
                  <SelectItem value="Moderate">Moderate</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="VeryHigh">Very High</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="createLifeStyleInfoRequest.smoking"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Smoking Habits</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select smoking habits" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Unknown">Unknown</SelectItem>
                  <SelectItem value="None">None</SelectItem>
                  <SelectItem value="Occasional">Occasional</SelectItem>
                  <SelectItem value="Regular">Regular</SelectItem>
                  <SelectItem value="Heavy">Heavy</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="createLifeStyleInfoRequest.alcohol"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Alcohol Consumption</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select alcohol consumption" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Unknown">Unknown</SelectItem>
                  <SelectItem value="None">None</SelectItem>
                  <SelectItem value="Occasional">Occasional</SelectItem>
                  <SelectItem value="Regular">Regular</SelectItem>
                  <SelectItem value="Heavy">Heavy</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full">Next</Button>
      </form>
    </Form>
  );
}