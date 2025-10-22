import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { ButtonText } from '@/app/enum/button-text/button-text';
import { FirebaseService } from '@/firebase.service';
import { RegisterForm, RegisterFormModel } from '@/app/models/register.models';
import { ZodError } from 'zod';
import { UserRegistrationService } from '@/app/services/user-registration.service';

@Component({
  selector: 'app-start',
  templateUrl: './start.page.html',
  styleUrls: ['./start.page.scss'],
  standalone: false,
})
export class StartPage {
  constructor(
    private firebaseService: FirebaseService,
    private userRegistrationService: UserRegistrationService,
    private toastController: ToastController,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ButtonText = ButtonText;

  inputs: RegisterForm = {
    username: '',
    email: '',
    password: '',
    passwordConfirm: '',
  };

  errorMessage: string = '';

  /* Redireccionamiento a vista welcome-nutri-fit */
  backWelcome() {
    this.router.navigate(['./welcome-nutri-fit']);
  }

  /* Redireccionamiento a vista login */
  goToLogin() {
    this.router.navigate(['./login']);
  }

  /**
   * Registra un nuevo usuario con email y contraseña en Firebase.
   *
   * Valida los datos con Zod antes de enviarlos.
   * Si el registro es exitoso, guarda los datos en el servicio compartido
   * y navega al siguiente formulario de onboarding.
   *
   * @async
   * @returns {Promise<void>}
   */
  async onSignup() {
    try {
      const result = RegisterFormModel.safeParse(this.inputs);

      if (!result.success) {
        throw result.error;
      }
      
      // Se registra al usuario en Firebase
      await this.firebaseService.register(result.data);
      
      // Se guardan los datos del primer paso en el servicio compartido
      this.userRegistrationService.setData(result.data);

      // Navega al siguiente formulario
      this.router.navigate(['./about-person'], { relativeTo: this.route });
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
    await toast.present();
  }

  /**
   * Registra o inicia sesión con Google mediante popup.
   *
   * Utiliza el método loginWithGooglePopup del servicio FirebaseService.
   * Redirige al usuario a '/about-you' si es nuevo, o a '/home' si ya existía.
   * Muestra un toast de bienvenida con el nombre del usuario.
   *
   * @async
   * @returns {Promise<void>}
   */
  async signupWithGoogle() {
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
      });
      await toast.present();
    } catch (error: any) {
      // Mostrar toast de error si falla la autenticación
      const toast = await this.toastController.create({
        message: 'Error al registrarte con Google: ' + (error.message || ''),
        duration: 3000,
        color: 'danger',
      });
      await toast.present();
    }
  }
}
