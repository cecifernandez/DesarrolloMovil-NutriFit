import { Component } from '@angular/core';
import { FirebaseService } from '@/firebase.service';

import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { ButtonText } from '@/app/enum/button-text/button-text';
import { ButtonIcon } from '@/app/enum/button-icon/button-icon';
import { InputText } from '@/app/enum/input-text/input-text';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false
})
export class LogInPage {
  ButtonText = ButtonText;
  ButtonIcon = ButtonIcon;

  ButtonInputEmail = InputText;
  ButtonInputPassword = InputText;

  email: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(
    private firebaseService: FirebaseService,
    private router: Router,
    private toastController: ToastController
  ) {}

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
      const user = await this.firebaseService.login(this.email, this.password);
      console.log('Usuario logueado:', user);
      this.router.navigate(['./home']);
    } catch (error: any) {
      console.error('Error al iniciar sesión:', error);

      let errorMsg = 'Error desconocido';

      const errorCode = error?.code || error?.error?.message;

      switch (errorCode) {
        case 'auth/user-not-found':
        case 'EMAIL_NOT_FOUND':
          errorMsg = 'Correo no registrado';
          break;

        case 'auth/wrong-password':
        case 'INVALID_PASSWORD':
        case 'auth/invalid-credential':
        case 'INVALID_LOGIN_CREDENTIALS':
          errorMsg = 'Correo o contraseña incorrectos';
          break;

        case 'auth/invalid-email':
        case 'INVALID_EMAIL':
          errorMsg = 'Correo electrónico inválido';
          break;

        default:
          errorMsg = error.message || errorCode || 'Error desconocido';
          break;
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
      color: 'danger',
      position: 'middle',
    });
    toast.present();
  }
}
