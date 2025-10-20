import { z } from 'zod';

export const LoginFormModel =  z.object({
  email: z.string().email({ message: "El email debe ser un correo válido" }),
  password: z.string().min(8, { message: "Contraseña incorrecta" }),
})

export type LoginForm = z.infer<typeof LoginFormModel>;