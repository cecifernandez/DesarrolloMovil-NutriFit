import z from "zod";
import { ExerciseModel } from "./exercise.models";

export const RoutineTypeModel = z.object({
  name: z.string(),
  paramName: z.enum(['type', 'muscle']),
  paramValue: z.string(),
  exercises: z.array(ExerciseModel),
  selected: z.boolean().optional(),
  selectedExercises: z.array(ExerciseModel).optional(),
  expanded: z.boolean().optional(),
});

export type RoutineSchema = z.infer<typeof RoutineTypeModel>;