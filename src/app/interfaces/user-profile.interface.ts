import { GoalOption } from "@/types/goal-option.type";
import { RoutineType } from "./routine.category.inteface";

export interface UserProfile {
  username: string;

  /** Datos personales */
  birthDate: string;
  weight: number | undefined;
  height: number | undefined;
  gender: 'Masculino' | 'Femenino' | 'Otro';

  /** Objetivos del usuario */
  goalsOptions: GoalOption[];

  /** Rutinas seleccionadas */
  routines: RoutineType[];

  imageUser?: string;

  createdAt: string;
  updatedAt?: string;
}