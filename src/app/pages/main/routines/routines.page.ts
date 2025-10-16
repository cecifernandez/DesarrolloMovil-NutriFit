import { Component, OnInit } from '@angular/core';
import { ExercisesService } from 'src/app/services/exercises.service';

/**
 * Representa una categoría de rutina (por ejemplo: "Cardio" o "Musculación").
 *
 * @interface RoutineCategory
 * @property {string} name - Nombre visible de la categoría.
 * @property {'type' | 'muscle'} paramName - Tipo de parámetro usado para buscar en la API.
 * @property {string} paramValue - Valor del parámetro (por ejemplo, "cardio" o "glutes").
 * @property {any[]} exercises - Lista de ejercicios que pertenecen a esta categoría.
 * @property {boolean} selected - Indica si la rutina fue seleccionada por el usuario.
 * @property {any[]} selectedExercises - Ejercicios que el usuario seleccionó dentro de esta categoría.
 */
interface RoutineCategory {
  name: string;
  paramName: 'type' | 'muscle';
  paramValue: string;
  exercises: any[];
  selected: boolean;
  selectedExercises: any[];
}

@Component({
  selector: 'app-routines',
  templateUrl: './routines.page.html',
  styleUrls: ['./routines.page.scss'],
  standalone: false
})
export class RoutinesPage implements OnInit {
  /** Lista de categorías de rutinas cargadas desde la API o mocks. */
  categories: RoutineCategory[] = [];
  /** Lista de nombres de rutinas seleccionadas - cards (máximo 3). */
  selectedRoutines: string[] = [];

  constructor(private exercisesService: ExercisesService) {}

  /**
   * Método del ciclo de vida de Angular.
   * Se ejecuta automáticamente cuando la página se inicializa.
   *
   * @returns {void}
   */
  ngOnInit() {
    this.loadRoutines();
  }

  /**
   * Carga las rutinas base desde el servicio `ExercisesService`.
   *
   * Este método define una lista de categorías preestablecidas y
   * solicita los ejercicios correspondientes para cada una.
   * Cada categoría se guarda en el array `categories` junto con sus ejercicios.
   *
   * @returns {void}
   */
  loadRoutines() {
    const baseCategories: Omit<RoutineCategory, 'exercises' | 'selected' | 'selectedExercises'>[] = [
      { name: 'Cardio', paramName: 'type', paramValue: 'cardio' },
      { name: 'Musculación', paramName: 'type', paramValue: 'strength' },
      { name: 'Piernas y glúteos', paramName: 'muscle', paramValue: 'glutes' },
      { name: 'Entrenamiento de fuerza', paramName: 'type', paramValue: 'powerlifting' },
    ];

    // Por cada categoría base, pedimos ejercicios al servicio
    baseCategories.forEach((cat) => {
      this.exercisesService.getExercises(cat.paramName, cat.paramValue, 10).subscribe({
        next: (data) => {
          this.categories.push({
            ...cat,
            exercises: data.slice(0, 10),
            selected: false,
            selectedExercises: []
          });
          console.log('✅ Categoría cargada:', cat.name, data);
        },
        error: (err) => {
          console.error(`Error al cargar ${cat.name}:`, err);
        }
      });
    });
  }

  /**
   * Maneja la selección o deselección de una rutina completa.
   *
   * - Permite seleccionar hasta 3 rutinas al mismo tiempo.
   * - Si la rutina ya estaba seleccionada, se desactiva.
   * - Si se intenta seleccionar más de 3, muestra un aviso.
   *
   * @param {RoutineCategory} category - La categoría de rutina que se va a (de)seleccionar.
   * @returns {void}
   */
  toggleRoutineSelection(category: RoutineCategory) {
    if (category.selected) {
      category.selected = false;
      return;
    }
    if (this.selectedRoutines.length >= 3) {
      alert('Solo podés seleccionar hasta 3 rutinas.');
      return;
    }

    category.selected = true;

    if (!this.selectedRoutines.includes(category.paramValue)) {
      this.selectedRoutines.push(category.paramValue);
    }
  }

  /**
   * Recibe el evento del componente hijo `<card-rutin>`.
   *
   * Busca la categoría correspondiente por su nombre y llama a
   * `toggleRoutineSelection()` para manejar la selección visual y lógica.
   *
   * @param {string} cardTitle - El título de la card seleccionada.
   * @returns {void}
   */
  onCardSelected(cardTitle: string) {
    const category = this.categories.find(
      c => c.name.toLowerCase() === cardTitle.toLowerCase()
    );
    if (category) {
      this.toggleRoutineSelection(category);
    }
  }

  /**
   * Maneja la selección y deselección de ejercicios dentro de una rutina.
   *
   * - Cada rutina puede tener un máximo de 5 ejercicios seleccionados.
   * - Si el ejercicio ya estaba elegido, se elimina de la lista.
   * - Si aún hay espacio, se agrega a `selectedExercises`.
   *
   * @param {RoutineCategory} category - La categoría de rutina donde se selecciona el ejercicio.
   * @param {any} exercise - El ejercicio que se selecciona o deselecciona.
   * @returns {void}
   */
  toggleExerciseSelection(category: RoutineCategory, exercise: any) {
    const index = category.selectedExercises.findIndex(e => e.name === exercise.name);

    if (index >= 0) {
      category.selectedExercises.splice(index, 1);
    } else {
      if (category.selectedExercises.length >= 5) {
        alert('Solo podés seleccionar hasta 5 ejercicios por rutina.');
        return;
      }
      category.selectedExercises.push(exercise);
    }

    // Cada vez que el usuario selecciona o deselecciona un ejercicio,
    // se actualiza en el service para que el Home lo pueda leer luego.
    this.exercisesService.setSelectedExercises(category.paramValue, category.selectedExercises);
  }

  /**
   * Verifica si un ejercicio está seleccionado dentro de una rutina.
   *
   * @param {RoutineCategory} category - Categoría de la rutina.
   * @param {any} exercise - Ejercicio a verificar.
   * @returns {boolean} `true` si el ejercicio está seleccionado, de lo contrario `false`.
   */
  isExerciseSelected(category: RoutineCategory, exercise: any): boolean {
    return category.selectedExercises.some(e => e.name === exercise.name);
  }
}


