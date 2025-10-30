import { z } from 'zod';

/**
 * Esquema de validación del formulario de registro.
 *
 * Usa Zod para validar los campos básicos que se suelen pedir al crear una cuenta:
 * - `username`: obligatorio, mínimo 5 caracteres.
 * - `email`: obligatorio y debe tener formato de correo válido.
 * - `password`: obligatoria, mínimo 8 caracteres.
 * - `passwordConfirm`: obligatoria, usada solo para confirmar la contraseña.
 *
 * Además, se aplica un `refine(...)` al final para validar una **regla de negocio**:
 * la contraseña y su confirmación deben ser iguales. Si no coinciden, se setea
 * el error específicamente sobre el campo `passwordConfirm`.
 *
 * @constant
 * @type {z.ZodEffects<z.ZodObject>}
 */
export const RegisterFormModel = z.object({
  username: z
    .string()
    .min(5, { message: 'El nombre requiere un mínimo de 5 caracteres' }),
  email: z
    .string()
    .email({ message: 'El email debe ser un correo válido' }),
  password: z
    .string()
    .min(8, { message: 'La contraseña debe tener al menos 8 caracteres' }),
  passwordConfirm: z.string(),
}).refine(
  (data) => data.password === data.passwordConfirm,
  {
    message: 'Las contraseñas no coinciden',
    path: ['passwordConfirm'],
  }
);

/**
 * Tipo TypeScript derivado del esquema `RegisterFormModel`.
 *
 * Se usa para tipar el formulario de registro, de forma que la app y la validación
 * de Zod se mantengan sincronizadas.
 *
 * @typedef {Object} RegisterForm
 */
export type RegisterForm = z.infer<typeof RegisterFormModel>;
