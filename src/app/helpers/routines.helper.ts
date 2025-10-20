import { forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { ExercisesService } from '@/app/services/exercises.service';
import { RoutineType } from '@/app/interfaces/routine.category.inteface';

export function loadBaseRoutines(
  exercisesService: ExercisesService
): Promise<RoutineType[]> {
  const baseCategories: Omit<RoutineType, 'exercises' | 'selected' | 'selectedExercises'>[] = [
    { name: 'Cardio', paramName: 'type', paramValue: 'cardio' },
    { name: 'Musculación', paramName: 'type', paramValue: 'strength' },
    { name: 'Piernas y Glúteos', paramName: 'muscle', paramValue: 'glutes' },
    { name: 'Entrenamiento de Fuerza', paramName: 'type', paramValue: 'powerlifting' },
  ];

  const requests = baseCategories.map((cat) =>
    exercisesService.getExercises(cat.paramName, cat.paramValue, 10).pipe(
      map((data) => ({
        ...cat,
        exercises: data.slice(0, 10),
        selected: false,
        selectedExercises: [],
      }))
    )
  );

  return forkJoin(requests)
    .toPromise()
    .then((categories) => categories ?? []);
}
