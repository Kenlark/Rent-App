import { z } from "zod";

const RegisterUserSchema = z.object({
  firstName: z.string().min(1, { message: "Le prénom est requis." }),
  lastName: z.string().min(1, { message: "Le nom est requis." }),
  email: z.string().email({ message: "Email invalide" }),
  password: z.string().min(6, {
    message: "Le mot de passe doit comporter au moins 6 caractères.",
  }),
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
    .min(9, { message: "Le numéro de téléphone est invalide (trop court)." })
    .max(10, { message: "Le numéro de téléphone est invalide (trop long)" }),
});

const LoginUserSchema = z.object({
  email: z.string().email({ message: "Email invalide" }),
  password: z.string().trim(),
});

export { RegisterUserSchema, LoginUserSchema };
