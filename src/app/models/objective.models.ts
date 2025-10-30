import { z } from 'zod';
import { RoutineTypeModel } from './routine.models';

/**
 * Esquema de objetivos personales del usuario.
 *
 * Este esquema modela las distintas metas que el usuario puede tener en la app
 * (mejorar salud, bajar de peso, ganar masa muscular, etc.) y además permite
 * que el usuario escriba un objetivo personalizado en el campo `otro`.
 *
 * Campos:
 * - `mejorarSalud`: indica si el usuario quiere mejorar su salud general.
 * - `bajarPeso`: indica si el usuario quiere bajar de peso.
 * - `ganarMasaMuscular`: indica si el usuario quiere aumentar músculo.
 * - `reducirEstres`: indica si el usuario quiere disminuir estrés.
 * - `dormirMejor`: indica si el usuario quiere mejorar su calidad de sueño.
 * - `otro`: texto libre opcional, máximo 100 caracteres.
 * - `selectedRoutines`: (opcional) rutinas sugeridas/seleccionadas para ese objetivo.
 *
 * Además, se aplica un `refine(...)` para asegurar una regla de negocio:
 * **al menos un objetivo debe estar marcado** o, en su defecto, el campo `otro`
 * debe estar completado con un texto no vacío.
 *
 * @constant
 * @type {z.ZodEffects<z.ZodObject>}
 */
export const ObjectivePersonalModel = z
  .object({
    mejorarSalud: z.boolean(),
    bajarPeso: z.boolean(),
    ganarMasaMuscular: z.boolean(),
    reducirEstres: z.boolean(),
    dormirMejor: z.boolean(),
    otro: z.string().max(100).optional(),
    selectedRoutines: z.array(RoutineTypeModel).optional(),
  })
  .refine(
    (data) =>
      data.mejorarSalud ||
      data.bajarPeso ||
      data.ganarMasaMuscular ||
      data.reducirEstres ||
      data.dormirMejor ||
      (data.otro && data.otro.trim() !== ''),
    { message: "Debes elegir al menos un objetivo o completar el campo 'Otro'" }
  );

/**
 * Tipo TypeScript derivado del esquema `ObjectivePersonalModel`.
 *
 * Se usa para tipar formularios, servicios o componentes que trabajen con
 * los objetivos del usuario, manteniendo sincronía con la validación de Zod.
 *
 * @typedef {Object} PersonalObjective
 */
export type PersonalObjective = z.infer<typeof ObjectivePersonalModel>;
