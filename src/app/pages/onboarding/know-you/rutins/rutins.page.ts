import { Component, OnInit } from '@angular/core';
import { UserRegistrationService } from '@/app/services/user-registration.service';
import { RoutineType } from '@/app/interfaces/routine.category.inteface';
import { ExercisesService } from '@/app/services/exercises.service';
import { loadBaseRoutines } from '@/app/helpers/routines.helper';
import { ToastController } from '@ionic/angular';
import { Router, ActivatedRoute } from '@angular/router';
import { Exercise } from '@/app/interfaces/exercise.interface';
import z, { ZodError } from 'zod';
import { RoutineTypeModel } from '@/app/models/routine.models';
import { ButtonText } from '@/app/enum/button-text/button-text';


@Component({
  selector: 'rutins',
  templateUrl: './rutins.page.html',
  styleUrls: ['./rutins.page.scss'],
  standalone: false,
})
export class RutinsPage implements OnInit {
  ButtonText = ButtonText;
  errorMessage: string = '';
  categories: RoutineType[] = [];
  selectedRoutines: string[] = [];
  maxRoutines = 3;
  maxExercises = 5;

  constructor(
    private exercisesService: ExercisesService,
    private userRegistratorService: UserRegistrationService,
    private router: Router,
    private route: ActivatedRoute,
    private toastController: ToastController
  ) { }

  async ngOnInit() {
    try {
      this.categories = await loadBaseRoutines(this.exercisesService);

      const result = z.array(RoutineTypeModel).safeParse(this.categories);

      if (!result.success) throw result.error;
    } catch (error: unknown) {
      let errorMsg = 'Hubo un error al cargar las rutinas.';

      if (error instanceof ZodError && error.issues.length > 0) {
        errorMsg = error.issues[0].message;
      }

      this.errorMessage = errorMsg;
      this.mostrarErrorToast(errorMsg);
    }
  }

  /**
 * Devuelve la cantidad de rutinas actualmente seleccionadas.
 *
 * Cuenta simplemente la longitud del arreglo `selectedRoutines`, que actúa como
 * un registro rápido de las rutinas elegidas por el usuario.
 *
 * @returns {number} Número de rutinas seleccionadas.
 */
  get selectedRoutineCount(): number {
    return this.selectedRoutines.length;
  }

  /**
   * Indica si ya se alcanzó el máximo de rutinas que el usuario puede seleccionar.
   *
   * Compara la cantidad actual (`selectedRoutineCount`) con el límite definido
   * en `this.maxRoutines` (por ejemplo, 3). Si ya llegó o lo superó, devuelve `true`.
   *
   * @returns {boolean} `true` si no se pueden seleccionar más rutinas.
   */
  get maxSelectedReached(): boolean {
    return this.selectedRoutineCount >= this.maxRoutines;
  }

  /**
   * Maneja la selección de una tarjeta de rutina (categoría).
   *
   * - Busca la categoría por nombre.
   * - Si no existe, no hace nada.
   * - Si la categoría NO estaba seleccionada y ya se alcanzó el máximo permitido,
   *   muestra un toast de error y no permite la selección.
   *
   * Esto evita que el usuario marque más de 3 rutinas aunque intente hacerlo
   * desde la UI de tarjetas.
   *
   * @param {string} cardTitle - Nombre/título de la categoría seleccionada.
   * @returns {Promise<void>}
   */
  async onCardSelected(cardTitle: string): Promise<void> {
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

  /**
   * Maneja la selección/deselección de ejercicios dentro de una categoría.
   *
   * Flujo:
   * 1. Busca la categoría por título.
   * 2. Si la categoría NO está seleccionada pero el usuario ya llegó al máximo
   *    de rutinas permitidas, se muestra un error y no se permite seleccionar.
   * 3. Actualiza `selectedExercises` de la categoría con los ejercicios llegados
   *    en el evento.
   * 4. Si ahora la categoría tiene ejercicios seleccionados y antes no estaba
   *    marcada como seleccionada, la marca y la agrega a `selectedRoutines`.
   * 5. Si se quitaron todos los ejercicios y la categoría estaba seleccionada,
   *    la desmarca y la quita de `selectedRoutines`.
   *
   * Esto mantiene sincronizado:
   * - El estado visual de la tarjeta
   * - El listado de rutinas seleccionadas
   * - El límite máximo permitido
   *
   * @param {{ cardTitle: string; exercises: Exercise[] }} event - Datos de la selección de ejercicios.
   * @returns {Promise<void>}
   */
  async onExerciseSelected(event: {
    cardTitle: string;
    exercises: Exercise[];
  }): Promise<void> {
    const category = this.categories.find((c) => c.name === event.cardTitle);
    if (!category) return;

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
   * Valida las rutinas seleccionadas y, si todo está bien, guarda los datos y navega al home.
   *
   * - Primero valida con Zod que el arreglo `this.categories` cumple con el esquema
   *   `RoutineTypeModel[]`.
   * - Si la validación falla, muestra el primer mensaje de error.
   * - Si la validación pasa, guarda en el servicio de registro solo las categorías
   *   que quedaron marcadas (`selected === true`).
   * - Finalmente navega a `./home`.
   *
   * @returns {void}
   */
  goToHome(): void {
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

  /**
   * Vuelve al paso anterior del onboarding (objetivos de la persona).
   *
   * Usa navegación relativa para mantenerse dentro del flujo actual.
   *
   * @returns {void}
   */
  backObjectivePerson(): void {
    this.router.navigate(['../objective-person'], { relativeTo: this.route });
  }

  /**
   * Muestra un toast de error con estilo "danger".
   *
   * Se usa en todas las validaciones de límite (máx. 3 rutinas) y en errores de Zod.
   *
   * @param {string} message - Mensaje a mostrar en el toast.
   * @returns {Promise<void>} Promesa que se resuelve cuando el toast se presentó.
   */
  async mostrarErrorToast(message: string): Promise<void> {
    const toast = await this.toastController.create({
      message,
      duration: 3000,
      color: 'danger',
      position: 'middle',
    });
    await toast.present();
  }

}
