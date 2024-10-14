import { z } from "zod";

const RegisterUserSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(3, { message: "Doit avoir au minimum 3 caractères" })
    .max(20, "Doit avoir au maximum 20 caractères"),
  lastName: z
    .string()
    .trim()
    .min(3, { message: "Doit avoir au minimum 3 caractères" })
    .max(30, "Doit avoir au maximum 30 caractères"),
  email: z.string().email({ message: "Email invalide" }),
  password: z
    .string()
    .trim()
    .min(6, { message: "Doit avoir au minimum 6 caractères" }),
});

const LoginUserSchema = z.object({
  email: z.string().email({ message: "Email invalide" }),
  password: z.string().trim(),
});

export { RegisterUserSchema, LoginUserSchema };
