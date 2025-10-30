import z from "zod";
import { ExerciseModel } from "./exercise.models";

/**
 * Esquema de tipo de rutina de entrenamiento.
 *
 * Modela una categoría o tipo de rutina que la app puede mostrar (por ejemplo:
 * "Cardio", "Musculación", "Piernas y Glúteos", etc.) y cómo obtener sus ejercicios.
 *
 * Campos:
 * - `name`: nombre visible de la rutina/categoría.
 * - `paramName`: nombre del parámetro que se usará para filtrar en la API
 *   (solo se permiten `'type'` o `'muscle'`).
 * - `paramValue`: valor del parámetro que se usará en la consulta (por ejemplo, `'cardio'`, `'glutes'`).
 * - `exercises`: lista de ejercicios que pertenecen a esta rutina (validados con `ExerciseModel`).
 * - `selected`: (opcional) indica si la rutina está actualmente seleccionada por el usuario.
 * - `selectedExercises`: (opcional) ejercicios que el usuario eligió dentro de la rutina.
 * - `expanded`: (opcional) flag de UI para mostrar/ocultar el detalle de la rutina.
 *
 * Este esquema asegura que toda rutina tenga la info necesaria para renderizarla
 * y también para pedir más ejercicios a la API en base a un filtro.
 *
 * @constant
 * @type {z.ZodObject}
 */
export const RoutineTypeModel = z.object({
  name: z.string(),
  paramName: z.enum(['type', 'muscle']),
  paramValue: z.string(),
  exercises: z.array(ExerciseModel),
  selected: z.boolean().optional(),
  selectedExercises: z.array(ExerciseModel).optional(),
  expanded: z.boolean().optional(),
});

/**
 * Tipo TypeScript derivado del esquema `RoutineTypeModel`.
 *
 * Se usa en servicios, stores o componentes que manejen rutinas, manteniendo
 * sincronía con la validación de Zod.
 *
 * @typedef {Object} RoutineSchema
 */
export type RoutineSchema = z.infer<typeof RoutineTypeModel>;
