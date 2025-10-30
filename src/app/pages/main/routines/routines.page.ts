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

    maxRoutines = 3;
  maxExercises = 5;

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

    forkJoin(requests).subscribe({
      next: (categories: RoutineType[]) => {
        this.categories = categories;
      },
      error: (err) => {
      }
    });

    
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

   get selectedRoutineCount(): number {
    return this.selectedRoutines.length;
  }
    get maxSelectedReached(): boolean {
    return this.selectedRoutineCount >= this.maxRoutines;
  }

  async onCardSelected(cardTitle: string) {
    const category = this.categories.find(
      (c) => c.name.toLowerCase() === cardTitle.toLowerCase()
    );
    if (!category) return;

    const alreadySelected = category.selected;

    if (!alreadySelected && this.maxSelectedReached) {
      await this.mostrarErrorToast('Solo puedes seleccionar hasta 3 rutinas.');
      return;
    }
  }

  async onExerciseSelected(event: {
    cardTitle: string;
    exercises: Exercise[];
  }) {
    const category = this.categories.find((c) => c.name.toLowerCase() === event.cardTitle.toLowerCase());
    if (!category){
      return;
    } 

    if (!category.selected && this.maxSelectedReached) {
      await this.mostrarErrorToast('Ya alcanzaste el límite de 3 rutinas.');
      return;
    }

    category.selectedExercises = event.exercises;
    if (category.selectedExercises.length > 0 && !category.selected) {
      category.selected = true;
      this.selectedRoutines.push(category.paramValue);
    } else if (category.selectedExercises.length === 0 && category.selected) {
      category.selected = false;
      this.selectedRoutines = this.selectedRoutines.filter(
        (r) => r !== category.paramValue
      );
    }
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