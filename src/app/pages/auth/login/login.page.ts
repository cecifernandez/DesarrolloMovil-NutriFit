import { Component } from '@angular/core';
import { FirebaseService } from '@/firebase.service';

import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { ButtonText } from '@/app/enum/button-text/button-text';
import { ButtonIcon } from '@/app/enum/button-icon/button-icon';
import { InputText } from '@/app/enum/input-text/input-text';
import { LoginForm, LoginFormModel } from '@/app/models/login.models';
import { ZodError } from 'zod';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false,
})
export class LogInPage {
  constructor(
    private firebaseService: FirebaseService,
    private router: Router,
    private toastController: ToastController
  ) {}

  ButtonText = ButtonText;
  ButtonIcon = ButtonIcon;

  ButtonInputEmail = InputText;
  ButtonInputPassword = InputText;

  inputs: LoginForm = {
    email: '',
    password: '',
  };

  errorMessage: string = '';

  /* Redireccionamiento a vista welcome-nutri-fit */
  backWelcome() {
    this.router.navigate(['./welcome-nutri-fit']);
  }

  /* Redireccioonaiento a vista forgot-password */
  goToForgotPass() {
    this.router.navigate(['./forgot-password']);
  }

  /* Redireccioonaiento a vista register */
  goToRegister() {
    this.router.navigate(['./register']);
  }

  /**
   * Realiza el proceso de inicio de sesión del usuario.
   *
   * Esta función utiliza el servicio `firebaseService` para autenticar al usuario
   * con el correo y contraseña proporcionados. En caso de éxito, redirige al usuario
   * al dashboard. En caso de error, maneja diferentes tipos de errores de Firebase
   * y muestra un mensaje de error personalizado mediante un toast.
   *
   * @async
   * @returns {Promise<void>}
   */

  async login() {
    try {
      const result = LoginFormModel.safeParse(this.inputs);

      if (!result.success) {
        throw result.error;
      }

      await this.firebaseService.login(result.data);

      this.router.navigate(['./home']);
    } catch (error: any) {
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
   * Muestra un toast en pantalla con un mensaje de error.
   *
   * Este método se utiliza para informar al usuario de errores
   * de forma visual. El toast aparece en el centro de la pantalla,
   * y se cierra automáticamente tras 3 segundos.
   *
   * @param {string} message - El mensaje de error que se desea mostrar al usuario.
   * @async
   * @returns {Promise<void>}
   */

  async mostrarErrorToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 3000,
      color: 'red',
      position: 'middle',
    });
    toast.present();
  }
}