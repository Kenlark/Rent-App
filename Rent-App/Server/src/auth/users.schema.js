import { z } from "zod";

const RegisterUserSchema = z.object({
  firstName: z.string().min(1, { message: "Le prénom est requis." }),
  lastName: z.string().min(1, { message: "Le nom est requis." }),
  birthMonth: z
    .number()
    .min(1)
    .max(12, { message: "Mois de naissance invalide." }),
  birthYear: z.number().min(1900, { message: "Année invalide." }),
  address: z.string().min(1, { message: "L'adresse est requise." }),
  postalCode: z.string().min(1, { message: "Le code postal est requis." }),
  city: z.string().min(1, { message: "La ville est requise." }),
  phoneNumber: z
    .string()
    .min(1, { message: "Le numéro de téléphone est requis." }),
});

const LoginUserSchema = z.object({
  email: z.string().email({ message: "Email invalide" }),
  password: z.string().trim(),
});

export { RegisterUserSchema, LoginUserSchema };
