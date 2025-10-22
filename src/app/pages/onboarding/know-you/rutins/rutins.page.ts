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
  ) {}

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

  // --- GETTERS ---
  get selectedRoutineCount(): number {
    return this.selectedRoutines.length;
  }

  get maxSelectedReached(): boolean {
    return this.selectedRoutineCount >= this.maxRoutines;
  }

  // --- CARD (RUTINA) SELECCIÓN ---
  async onCardSelected(cardTitle: string) {
    const category = this.categories.find(
      (c) => c.name.toLowerCase() === cardTitle.toLowerCase()
    );
    if (!category) return;

    const alreadySelected = category.selected;

    // Si intenta seleccionar una cuarta rutina
    if (!alreadySelected && this.maxSelectedReached) {
      await this.mostrarErrorToast('Solo puedes seleccionar hasta 3 rutinas.');
      return;
    }
  }

  // --- EJERCICIO SELECCIÓN ---
  async onExerciseSelected(event: {
    cardTitle: string;
    exercises: Exercise[];
  }) {
    const category = this.categories.find((c) => c.name === event.cardTitle);
    if (!category) return;

    // Bloquear si intenta seleccionar ejercicios de una rutina NO seleccionada y ya alcanzó el límite
    if (!category.selected && this.maxSelectedReached) {
      await this.mostrarErrorToast('Ya alcanzaste el límite de 3 rutinas.');
      return;
    }

    // Permitir seleccionar o deseleccionar ejercicios dentro de las rutinas elegidas
    category.selectedExercises = event.exercises;

    // --- Manejo del estado de selección ---
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

  // --- NAVEGACIÓN Y ERRORES ---
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

  backObjectivePerson() {
    this.router.navigate(['../objective-person'], { relativeTo: this.route });
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
