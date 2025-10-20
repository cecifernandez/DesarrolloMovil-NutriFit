import { Component, OnInit } from '@angular/core';
import { ButtonText } from '@/app/enum/button-text/button-text';
import { UserRegistrationService } from '@/app/services/user-registration.service';
import { ActivatedRoute, Router } from '@angular/router';
import {
  ObjectivePersonalModel,
} from '@/app/models/objective.models';
import { ToastController } from '@ionic/angular';
import { ZodError } from 'zod';

type ObjectivePerson = {
  mejorarSalud: boolean;
  bajarPeso: boolean;
  ganarMasaMuscular: boolean;
  reducirEstres: boolean;
  dormirMejor: boolean;
  otro: string;
};

type ObjectiveKey = Exclude<keyof ObjectivePerson, 'otro'>;

@Component({
  selector: 'app-objective',
  templateUrl: './objective.page.html',
  styleUrls: ['./objective.page.scss'],
  standalone: false,
})
export class ObjectivePage implements OnInit {
  ButtonText = ButtonText;
  value: boolean = false;
  
  errorMessage: string = '';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private userRegistrationService: UserRegistrationService,
    private toastController: ToastController
  ) {}

  ngOnInit() {}

  backAboutPerson() {
    this.router.navigate(['../about-person'], { relativeTo: this.route });
  }

  objectivePerson: ObjectivePerson = {
    mejorarSalud: false,
    bajarPeso: false,
    ganarMasaMuscular: false,
    reducirEstres: false,
    dormirMejor: false,
    otro: '',
  };

  get selectedCount(): number {
    const {
      mejorarSalud,
      bajarPeso,
      ganarMasaMuscular,
      reducirEstres,
      dormirMejor,
    } = this.objectivePerson;
    let count = [
      mejorarSalud,
      bajarPeso,
      ganarMasaMuscular,
      reducirEstres,
      dormirMejor,
    ].filter((v) => v).length;

    if (this.objectivePerson.otro.trim() !== '') {
      count += 1;
    }

    return count;
  }

  get maxReached(): boolean {
    return this.selectedCount > 0;
  }

  async onObjectiveChange(key: ObjectiveKey, value: boolean) {
    this.objectivePerson[key] = value;

    const selectedCount = Object.entries(this.objectivePerson)
      .filter(([k, v]) => {
        if (k === 'otro') return this.objectivePerson.otro.trim() !== '';
        return v === true;
      }).length;

    if (selectedCount > 3) {
      this.objectivePerson[key] = false; // revertir

      setTimeout(() => {
        this.objectivePerson = { ...this.objectivePerson };
      });

      await this.mostrarErrorToast('Solo podés elegir hasta 3 objetivos.');
    }

    if (typeof this.objectivePerson[key] === 'boolean') {
      this.objectivePerson[key] = value;
    }
  }

  goNext() {
    try {
      const result = ObjectivePersonalModel.safeParse(this.objectivePerson);

      if (!result.success) {
        throw result.error;
      }

      const { data } = result;

      // Se guardan los datos del primer paso en el servicio compartido
      this.userRegistrationService.setData(data);

      // Navega al siguiente formulario
      this.router.navigate(['../routines-person'], { relativeTo: this.route });
    } catch (error: unknown) {
      let errorMsg =
        'Hubo un error en la aplicación, intenta nuevamente más tarde.';

      if (error instanceof ZodError) {
        // primer error
        const errores = error.issues || [];

        if (errores && errores.length > 0) {
          errorMsg = errores[0].message;
        }
      } else {
        console.error(error);
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
