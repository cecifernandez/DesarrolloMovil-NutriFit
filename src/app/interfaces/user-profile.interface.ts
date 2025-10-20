import { GoalOption } from "@/types/goal-option.type";
import { RoutineType } from "./routine.category.inteface";

export interface UserProfile {
  uid: string; /** ID del usuario en Firebase */
  email: string;
  username: string;
  password: string;

  /** Datos personales */
  birthDate: string;
  weight: number;
  height: number;
  gender: 'Masculino' | 'Femenino' | 'Otro';

  /** Objetivos del usuario */
  goalsOptions: GoalOption[];

  /** Rutinas seleccionadas */
  routines: RoutineType[];

  createdAt: string;
  updatedAt?: string;
}