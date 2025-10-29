import { Exercise } from '@/app/interfaces/exercise.interface';
import { RoutineType } from '@/app/interfaces/routine.category.inteface';
import { Component, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { ExercisesService } from 'src/app/services/exercises.service';
import { ButtonText } from '@/app/enum/button-text/button-text';
import z, { ZodError } from 'zod';
import { RoutineTypeModel } from '@/app/models/routine.models';

import { UserRegistrationService } from '@/app/services/user-registration.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastController } from '@ionic/angular';


/**
 * Representa una categoría de rutina (por ejemplo: "Cardio" o "Musculación").
 *
 * @interface RoutineType
 * @property {string} name - Nombre visible de la categoría.
 * @property {'type' | 'muscle'} paramName - Tipo de parámetro usado para buscar en la API.
 * @property {string} paramValue - Valor del parámetro (por ejemplo, "cardio" o "glutes").
 * @property {any[]} exercises - Lista de ejercicios que pertenecen a esta categoría.
 * @property {boolean} selected - Indica si la rutina fue seleccionada por el usuario.
 * @property {any[]} exercises - Ejercicios que el usuario seleccionó dentro de esta categoría.
 */

@Component({
  selector: 'app-routines',
  templateUrl: './routines.page.html',
  styleUrls: ['./routines.page.scss'],
  standalone: false
})
export class RoutinesPage implements OnInit {
  ButtonText = ButtonText;
  errorMessage: string = '';


  /** Lista de categorías de rutinas cargadas desde la API o mocks. */
  categories: RoutineType[] = [];

  /** Lista de nombres de rutinas seleccionadas (máximo 3). */
  selectedRoutines: string[] = [];

  constructor(
    private exercisesService: ExercisesService,
    private toastController: ToastController,
    private router: Router,
    private userRegistratorService: UserRegistrationService,
    

  ) { }

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
    const baseCategories: Omit<RoutineType, 'exercises' | 'selected' | 'selectedExercises'>[] = [
      { name: 'Cardio', paramName: 'type', paramValue: 'cardio' },
      { name: 'Musculación', paramName: 'type', paramValue: 'strength' },
      { name: 'Piernas y glúteos', paramName: 'muscle', paramValue: 'glutes' },
      { name: 'Entrenamiento de fuerza', paramName: 'type', paramValue: 'powerlifting' },
    ];

    // Convertimos cada categoría en una llamada al servicio
    const requests = baseCategories.map(cat =>
      this.exercisesService.getExercises(cat.paramName, cat.paramValue, 10).pipe(
        map(data => ({
          ...cat,
          exercises: data.slice(0, 10),
          selected: false,
          selectedExercises: []
        }))
      )
    )

    // Ejecutamos todas en paralelo
    forkJoin(requests).subscribe({
      next: (categories: RoutineType[]) => {
        this.categories = categories;
        console.log('✅ Categorías cargadas:', categories);
      },
      error: (err) => {
        console.error('❌ Error al cargar rutinas:', err);
      }
    });

    // // Por cada categoría base, pedimos ejercicios al servicio
    // baseCategories.forEach((cat) => {
    //   this.exercisesService.getExercises(cat.paramName, cat.paramValue, 10).subscribe({
    //     next: (data) => {
    //       this.categories.push({
    //         ...cat,
    //         exercises: data.slice(0, 10),
    //         selected: false,
    //         selectedExercises: []
    //       });
    //       console.log('✅ Categoría cargada:', cat.name, data);
    //     },
    //     error: (err) => {
    //       console.error(`Error al cargar ${cat.name}:`, err);
    //     }
    //   });
    // });
  }

  /**
   * Maneja la selección o deselección de una rutina completa.
   *
   * - Permite seleccionar hasta 3 rutinas al mismo tiempo.
   * - Si la rutina ya estaba seleccionada, se desactiva.
   * - Si se intenta seleccionar más de 3, muestra un aviso.
   *
   * @param {RoutineType} category - La categoría de rutina que se va a (de)seleccionar.
   * @returns {void}
   */
  toggleRoutineSelection(category: RoutineType) {
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
   * @param {RoutineType} category - La categoría de rutina donde se selecciona el ejercicio.
   * @param {any} exercise - El ejercicio que se selecciona o deselecciona.
   * @returns {void}
   */
  toggleExerciseSelection(category: RoutineType, exercise: any) {
    const index = category.selectedExercises.findIndex(e => e.name === exercise.name);

    if (index >= 0) {
      category.exercises.splice(index, 1);
    } else {
      if (category.exercises.length >= 5) {
        alert('Solo podés seleccionar hasta 5 ejercicios por rutina.');
        return;
      }
      category.exercises.push(exercise);
    }

    // Cada vez que el usuario selecciona o deselecciona un ejercicio,
    // se actualiza en el service para que el Home lo pueda leer luego.
    this.exercisesService.setSelectedExercises(category.paramValue, category.selectedExercises);
  }

  /**
   * Verifica si un ejercicio está seleccionado dentro de una rutina.
   *
   * @param {RoutineType} category - Categoría de la rutina.
   * @param {any} exercise - Ejercicio a verificar.
   * @returns {boolean} `true` si el ejercicio está seleccionado, de lo contrario `false`.
   */
  isExerciseSelected(category: RoutineType, exercise: Exercise): boolean {
    return category.exercises.some(e => e.name === exercise.name);
  }

  goToHome() {
    try {
      const result = z.array(RoutineTypeModel).safeParse(this.categories);
      console.log(result);

      if (!result.success) throw result.error;

      this.userRegistratorService.setData({
        selectedRoutines: this.categories.filter((c) => c.selected),
      });

      this.router.navigate(['./home']);
    } catch (error: unknown) {
      let errorMsg = 'Hubo un error al cargar las rutinas.';

      if (error instanceof ZodError && error.issues.length > 0) {
        errorMsg = error.issues[0].message;
      }

      this.errorMessage = errorMsg;
      this.mostrarErrorToast(errorMsg);
    }
  }

  async mostrarErrorToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 3000,
      color: 'danger',
      position: 'middle',
    });
    await toast.present();
  }

}