import { z } from 'zod';
import { RoutineTypeModel } from './routine.models';

export const ObjectivePersonalModel = z.object({
  mejorarSalud: z.boolean(),
  bajarPeso: z.boolean(),
  ganarMasaMuscular: z.boolean(),
  reducirEstres: z.boolean(),
  dormirMejor: z.boolean(),
  otro: z.string().max(100).optional(),
  selectedRoutines: z.array(RoutineTypeModel).optional(),
}).refine(
  data => 
    data.mejorarSalud || data.bajarPeso || data.ganarMasaMuscular || data.reducirEstres || data.dormirMejor || (data.otro && data.otro.trim() !== ""),
  { message: "Debes elegir al menos un objetivo o completar el campo 'Otro'" }
);  

export type PersonalObjective = z.infer<typeof ObjectivePersonalModel>;