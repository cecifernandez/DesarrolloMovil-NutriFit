import { z } from 'zod';

/**
 * Esquema de datos personales del usuario.
 *
 * Valida la información básica que el usuario debe completar en el onboarding
 * o en su perfil para que la app pueda personalizar las rutinas o el seguimiento.
 *
 * Reglas:
 * - `birthDate`: debe ser una cadena no vacía (la vista debería darla ya formateada).
 * - `weight`: debe ser una cadena no vacía (ej. "70 kg" desde el modal de peso).
 * - `height`: debe ser una cadena no vacía (ej. "175 cm" desde el modal de altura).
 * - `gender`: debe ser uno de los 3 valores permitidos: "Masculino", "Femenino" u "Otro".
 *
 * Si alguno de estos campos no está completo, Zod devolverá el mensaje personalizado.
 *
 * @constant
 * @type {z.ZodObject}
 */
export const PersonalDataModel = z.object({
  birthDate: z.string().min(1, { message: 'Debes seleccionar una fecha de nacimiento' }),
  weight: z.string().min(1, { message: 'Debes seleccionar un peso' }),
  height: z.string().min(1, { message: 'Debes seleccionar un altura' }),
  gender: z.enum(['Masculino', 'Femenino', 'Otro'], {
    message: 'Debes seleccionar un género',
  }),
});

/**
 * Tipo TypeScript derivado de `PersonalDataModel`.
 *
 * Permite tipar formularios, servicios o componentes que trabajen con
 * los datos personales del usuario, manteniendo sincronía con el esquema de Zod.
 *
 * @typedef {Object} PersonalData
 */
export type PersonalData = z.infer<typeof PersonalDataModel>;
