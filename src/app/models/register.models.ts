import { z } from 'zod';

export const RegisterFormModel = z.object({
  username: z.string().min(5, { message: "El nombre requiere un mínimo de 5 caracteres" }),
  email: z.string().email({ message: "El email debe ser un correo válido" }),
  password: z.string().min(8, { message: "La contraseña debe tener al menos 8 caracteres" }),
  passwordConfirm: z.string(),
}).refine((data) => data.password === data.passwordConfirm, {
  message: "Las contraseñas no coinciden",
  path: ["passwordConfirm"],
});

export type RegisterForm = z.infer<typeof RegisterFormModel>;