import { z } from 'zod';

export const PersonalDataModel = z.object({
  birthDate: z.string().min(1, { message: "Debes seleccionar una fecha de nacimiento" }),
  weight: z.string().min(1, { message: "Debes seleccionar un peso" }),
  height: z.string().min(1, { message: "Debes seleccionar un altura" }),
  gender: z.enum(["Masculino", "Femenino", "Otro"], {
    message: "Debes seleccionar un género",
  }),
});

export type PersonalData = z.infer<typeof PersonalDataModel>;