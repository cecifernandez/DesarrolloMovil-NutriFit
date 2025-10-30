import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { ButtonText } from '@/app/enum/button-text/button-text';
import { ButtonIcon } from '@/app/enum/button-icon/button-icon';
import { UserRegistrationService } from '@/app/services/user-registration.service';
import { PersonalDataModel } from '@/app/models/person-data.models';
import { ZodError } from 'zod';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'about-you',
  templateUrl: './about-you.page.html',
  styleUrls: ['./about-you.page.scss'],
  standalone: false,
})
export class AboutYouPage {
  ButtonText  = ButtonText;
  ButtonIcon = ButtonIcon;

  errorMessage: string = '';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private userRegistrationService: UserRegistrationService,
    private toastController: ToastController
  ) {}

  personDate = {
    birthDate: '',
    weight: '',
    height: '',
    gender: ''
  };

 /**
 * Avanza al siguiente paso del onboarding guardando los datos personales.
 *
 * Flujo:
 * 1. Valida el objeto `this.personDate` contra el esquema `PersonalDataModel` (Zod).
 * 2. Si la validación falla, captura el primer mensaje de error y lo muestra.
 * 3. Si la validación pasa, convierte `weight` y `height` de string a número.
 * 4. Guarda los datos en el servicio de registro (`userRegistrationService.setData(...)`).
 * 5. Llama a `saveToFirestore()` para persistirlos en la base.
 * 6. Navega al formulario de objetivos (`/objective`).
 *
 * Cualquier error en el proceso muestra un toast amigable.
 *
 * @async
 * @returns {Promise<void>}
 */
async goNext(): Promise<void> {
  try {
    const result = PersonalDataModel.safeParse(this.personDate);

    if (!result.success) {
      throw result.error;
    }

    const data = {
      ...result.data,
      weight: parseInt(result.data.weight),
      height: parseInt(result.data.height),
    };

    this.userRegistrationService.setData(data);

    await this.userRegistrationService.saveToFirestore();

    this.router.navigate(['/objective'], { relativeTo: this.route });
  } catch (error: unknown) {
    let errorMsg =
      'Hubo un error en la aplicación, intenta nuevamente más tarde.';

    if (error instanceof ZodError) {
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

/**
 * Muestra un toast de error centrado en pantalla.
 *
 * @param {string} message - Mensaje a mostrar al usuario.
 * @returns {Promise<void>} Promesa que se resuelve cuando el toast fue presentado.
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