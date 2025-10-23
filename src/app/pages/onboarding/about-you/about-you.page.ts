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

  async goNext() {
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

      // Se guardan los datos del segundo paso en el servicio compartido
      this.userRegistrationService.setData(data);

       await this.userRegistrationService.saveToFirestore();


      // Navega al siguiente formulario
      this.router.navigate(['../objective-person'], { relativeTo: this.route });
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