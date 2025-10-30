import { z } from 'zod';

/**
 * Esquema de validación para ejercicios usando Zod.
 *
 * Define la estructura mínima que debe tener un ejercicio dentro de la app:
 * - `name`: nombre del ejercicio (obligatorio).
 * - `difficulty`: nivel de dificultad, limitado a 3 valores posibles
 *   (`'beginner'`, `'intermediate'`, `'hard'`), opcional.
 * - `id`: identificador único del ejercicio, opcional (útil cuando viene de una API).
 * - `sets`: cantidad de series, debe ser un entero positivo, opcional.
 * - `reps`: cantidad de repeticiones, debe ser un entero positivo, opcional.
 * - `duration`: duración en alguna unidad (segundos/minutos), debe ser positiva, opcional.
 *
 * Este esquema se puede usar tanto para validar datos que vienen de una API
 * como para asegurar que el frontend no guarde estructuras incompletas.
 *
 * @constant
 * @type {z.ZodObject}
 */
export const ExerciseModel = z.object({
  name: z.string(),
  difficulty: z.enum(['beginner', 'intermediate', 'hard']).optional(),
  id: z.string().optional(),
  sets: z.number().int().positive().optional(),
  reps: z.number().int().positive().optional(),
  duration: z.number().positive().optional(),
});

/**
 * Tipo TypeScript derivado del esquema `ExerciseModel`.
 *
 * Permite que todo el código de la app use un tipo seguro y sincronizado
 * con la validación de Zod. Si el esquema cambia, este tipo cambia también.
 *
 * @typedef {Object} ExerciseSchema
 */
export type ExerciseSchema = z.infer<typeof ExerciseModel>;
