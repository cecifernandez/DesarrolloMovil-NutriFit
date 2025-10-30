import { z } from 'zod';

/**
 * Esquema de validación del formulario de inicio de sesión.
 *
 * Usa Zod para asegurar que los datos ingresados por el usuario sean válidos
 * antes de enviarlos al backend / servicio de autenticación.
 *
 * Reglas:
 * - `email`: debe ser un correo válido; si no lo es, muestra el mensaje personalizado.
 * - `password`: debe tener al menos 8 caracteres; si no, muestra el mensaje personalizado.
 *
 * Este esquema se puede usar tanto en formularios reactivos (Angular/React) como
 * en validaciones previas a llamar a Firebase/Auth o a una API propia.
 *
 * @constant
 * @type {z.ZodObject}
 */
export const LoginFormModel = z.object({
  email: z.string().email({ message: 'El email debe ser un correo válido' }),
  password: z.string().min(8, { message: 'Contraseña incorrecta' }),
});

/**
 * Tipo TypeScript derivado del esquema `LoginFormModel`.
 *
 * Permite tipar el formulario y sus handlers de forma segura y en sincronía con Zod:
 * si cambian las reglas en el esquema, cambia el tipo también.
 *
 * @typedef {Object} LoginForm
 */
export type LoginForm = z.infer<typeof LoginFormModel>;
