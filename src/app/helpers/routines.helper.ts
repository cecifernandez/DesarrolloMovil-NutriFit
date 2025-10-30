import { forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { ExercisesService } from '@/app/services/exercises.service';
import { RoutineType } from '@/app/interfaces/routine.category.inteface';

/**
 * Carga un set de rutinas base a partir del servicio de ejercicios.
 *
 * La función define un conjunto fijo de categorías base (Cardio, Musculación, etc.),
 * y para cada una hace una llamada al `exercisesService` pidiendo hasta 10 ejercicios
 * filtrados por un parámetro determinado (`type`, `muscle`, etc.).
 *
 * Cada resultado del servicio se transforma en un objeto `RoutineType` completo,
 * agregando las propiedades:
 * - `exercises`: los primeros 10 ejercicios devueltos por la API.
 * - `selected`: en `false` por defecto.
 * - `selectedExercises`: arreglo vacío para que el usuario pueda elegir luego.
 *
 * Finalmente, se usa `forkJoin` para ejecutar **todas** las peticiones en paralelo
 * y devolver una única promesa que resuelve cuando todas terminaron.
 *
 * @param {ExercisesService} exercisesService - Servicio que expone el método `getExercises` para consultar la API.
 * @returns {Promise<RoutineType[]>} Promesa que resuelve con el arreglo de rutinas base cargadas.
 */
export function loadBaseRoutines(
  exercisesService: ExercisesService
): Promise<RoutineType[]> {
  const baseCategories: Omit<
    RoutineType,
    'exercises' | 'selected' | 'selectedExercises'
  >[] = [
      { name: 'Cardio', paramName: 'type', paramValue: 'cardio' },
      { name: 'Musculación', paramName: 'type', paramValue: 'strength' },
      { name: 'Piernas y Glúteos', paramName: 'muscle', paramValue: 'glutes' },
      {
        name: 'Entrenamiento de Fuerza',
        paramName: 'type',
        paramValue: 'powerlifting',
      },
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
