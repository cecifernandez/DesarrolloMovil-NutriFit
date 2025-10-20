import { z } from 'zod';

export const ExerciseModel = z.object({
  name: z.string(),
  difficulty: z.enum(['easy', 'intermediate', 'hard']).optional(),
  id: z.string().optional(),
  sets: z.number().int().positive().optional(),
  reps: z.number().int().positive().optional(),
  duration: z.number().positive().optional(),
});

export type ExerciseSchema = z.infer<typeof ExerciseModel>;