import { Exercise } from "./exercise.interface";

export interface RoutineType {
  name: string;
  paramName: 'type' | 'muscle';
  paramValue: string;
  exercises: Exercise[];
  selected: boolean;
  selectedExercises: Exercise[];
  expanded?: boolean;
}