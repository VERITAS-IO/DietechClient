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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const formSchema = z.object({
  createHealthInfoRequest: z.object({
    bloodPressure: z.enum(["Unknown", "Normal", "HighStageOne", "HighStageTwo", "HypertensiveCrisis"]),
    bloodType: z.enum([
      "Unknown",
      "A_Postive",
      "A_Negative",
      "B_Positive",
      "B_Negative",
      "AB_Positive",
      "AB_Negative",
      "O_Positive",
      "O_Negative",
    ]),
    bloodSugarLevel: z.string().transform((val) => val ? Number(val) : null).optional(),
    weight: z.string().transform(Number),
    height: z.string().transform(Number),
    chronicConditions: z.string(),
    allergies: z.string(),
    activelyUsedDrugs: z.string(),
  }),
});

export function HealthInfoForm({ data, onSubmit }) {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      createHealthInfoRequest: {
        bloodPressure: "Unknown",
        bloodType: "Unknown",
        bloodSugarLevel: "",
        weight: "70",
        height: "170",
        chronicConditions: "",
        allergies: "",
        activelyUsedDrugs: "",
        ...data,
      },
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="createHealthInfoRequest.bloodPressure"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Blood Pressure</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select blood pressure" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Unknown">Unknown</SelectItem>
                    <SelectItem value="Normal">Normal</SelectItem>
                    <SelectItem value="HighStageOne">High Stage 1</SelectItem>
                    <SelectItem value="HighStageTwo">High Stage 2</SelectItem>
                    <SelectItem value="HypertensiveCrisis">Hypertensive Crisis</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="createHealthInfoRequest.bloodType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Blood Type</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select blood type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Unknown">Unknown</SelectItem>
                    <SelectItem value="A_Postive">A+</SelectItem>
                    <SelectItem value="A_Negative">A-</SelectItem>
                    <SelectItem value="B_Positive">B+</SelectItem>
                    <SelectItem value="B_Negative">B-</SelectItem>
                    <SelectItem value="AB_Positive">AB+</SelectItem>
                    <SelectItem value="AB_Negative">AB-</SelectItem>
                    <SelectItem value="O_Positive">O+</SelectItem>
                    <SelectItem value="O_Negative">O-</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="createHealthInfoRequest.bloodSugarLevel"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Blood Sugar Level (mg/dL)</FormLabel>
              <FormControl>
                <Input type="number" step="0.1" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="createHealthInfoRequest.weight"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Weight (kg)</FormLabel>
                <FormControl>
                  <Input type="number" step="0.1" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="createHealthInfoRequest.height"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Height (cm)</FormLabel>
                <FormControl>
                  <Input type="number" step="0.1" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="createHealthInfoRequest.chronicConditions"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Chronic Conditions</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Enter chronic conditions (separate with commas)"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="createHealthInfoRequest.allergies"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Allergies</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Enter allergies (separate with commas)"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="createHealthInfoRequest.activelyUsedDrugs"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Actively Used Drugs</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Enter actively used drugs (separate with commas)"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full">Complete</Button>
      </form>
    </Form>
  );
}