import * as z from "zod";

export const userRegistrationSchema = z.object({
  userRegistrationRequest: z.object({
    firstName: z.string().min(2, "First name must be at least 2 characters"),
    lastName: z.string().min(2, "Last name must be at least 2 characters"),
    userName: z.string().min(3, "Username must be at least 3 characters"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Password must contain at least one uppercase letter, one lowercase letter, and one number"
      ),
    email: z.string().email("Invalid email address"),
    phoneNumber: z
      .string()
      .min(10, "Phone number must be at least 10 characters")
      .max(15, "Phone number must not exceed 15 characters"),
    roles: z.array(z.string()),
  }),
});