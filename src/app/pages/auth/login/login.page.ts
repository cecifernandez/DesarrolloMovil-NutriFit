import { Component } from '@angular/core';
import { FirebaseService } from '@/firebase.service';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { ButtonText } from '@/app/enum/button-text/button-text';
import { ButtonIcon } from '@/app/enum/button-icon/button-icon';
import { InputText } from '@/app/enum/input-text/input-text';
import { ZodError } from 'zod';
import { LoginForm } from '@/app/models/login.models';

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
    this.router.navigate(['/']);
  }

  /* Redireccionamiento a vista forgot-password */
  goToForgotPass() {
    this.router.navigate(['./forgot-password']);
  }

  /* Redireccionamiento a vista register */
  goToRegister() {
    this.router.navigate(['./register']);
  }

  async signinWithGoogle() {
    try {
      const result = await this.firebaseService.loginWithGooglePopup();

      const user = result.user!;
      const isNewUser = result.additionalUserInfo?.isNewUser;

      // Determinar ruta según sea usuario nuevo o existente
      const route = isNewUser ? '/about-you' : '/home';
      await this.router.navigateByUrl(route, { replaceUrl: true });

      // Mostrar toast de bienvenida
      const toast = await this.toastController.create({
        message: `¡Bienvenido ${user.displayName ?? 'usuario'}!`,
        duration: 3000,
        color: 'success',
        position: "bottom"
      });
      await toast.present();
    } catch (error: any) {
      // Mostrar toast de error si falla la autenticación
      const toast = await this.toastController.create({
        message: 'Error al registrarte con Google: ' + (error.message || ''),
        duration: 3000,
        color: 'white',
        position: "bottom"
      });
      await toast.present();
    }
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
    if (!this.inputs.email || !this.inputs.password) {
      const errorMsg = 'Por favor, completá todos los campos.';
      this.errorMessage = errorMsg;
      this.mostrarErrorToast(errorMsg);
      return;
    }

    try {
      const user = await this.firebaseService.login(this.inputs);

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
      position: 'bottom',
    });
    toast.present();
  }

  /**
   * Inicia sesión con Google mediante popup.
   *
   * Utiliza el método loginWithGooglePopup del servicio FirebaseService.
   * Redirige al usuario a '/about-you' si es nuevo, o a '/home' si ya existía.
   * Muestra un toast de bienvenida con el nombre del usuario.
   *
   * @async
   * @returns {Promise<void>}
   */
  async loginWithGoogle() {
    try {
      const result = await this.firebaseService.loginWithGooglePopup();

      const user = result.user!; // Usuario autenticado
      const isNewUser = result.additionalUserInfo?.isNewUser;

      // Determina la ruta a la que se redirige
      const route = isNewUser ? '/about-you' : '/home';
      await this.router.navigateByUrl(route, { replaceUrl: true });

      // Muestra toast de bienvenida
      const toast = await this.toastController.create({
        message: `¡Bienvenido ${user.displayName ?? 'usuario'}!`,
        duration: 3000,
        color: 'success',
      });
      await toast.present();
    } catch (error: any) {
      // Muestra toast de error en caso de fallo
      const toast = await this.toastController.create({
        message: 'Error al iniciar sesión con Google: ' + (error.message || ''),
        duration: 3000,
        color: 'danger',
      });
      await toast.present();
    }
  }
}