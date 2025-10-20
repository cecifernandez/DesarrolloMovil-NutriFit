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
   * Registra un nuevo usuario en Firebase.
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
}
