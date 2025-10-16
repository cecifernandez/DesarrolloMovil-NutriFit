import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { ButtonText } from '@/app/enum/button-text/button-text';
import { FirebaseService } from '@/firebase.service';

@Component({
  selector: 'app-start',
  templateUrl: './start.page.html',
  styleUrls: ['./start.page.scss'],
  standalone: false,
})
export class StartPage {
  username: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  errorMessage: string = '';
  ButtonText = ButtonText;

  constructor(
    private firebaseService: FirebaseService,
    private toastController: ToastController,
    private router: Router
  ) {}

  /**
   * Registra un nuevo usuario en Firebase.
   */
  async onSignup() {
    try {
      const userCredential = await this.firebaseService.register(this.email, this.password);
      console.log('Usuario registrado:', userCredential.user);

      // Redirige al flujo de onboarding (About You)
      this.router.navigate(['./about-you']);

    } catch (error: any) {
      console.error('Error en registro:', error);

      let errorMsg = 'Error desconocido';

      const errorCode = error?.code || error?.error?.message;

      switch (errorCode) {
        case 'auth/email-already-in-use':
        case 'EMAIL_EXISTS':
          errorMsg = 'El correo ya está registrado.';
          break;

        case 'auth/invalid-email':
        case 'INVALID_EMAIL':
          errorMsg = 'Correo electrónico inválido.';
          break;

        case 'auth/weak-password':
        case 'WEAK_PASSWORD':
          errorMsg = 'La contraseña es demasiado débil.';
          break;

        default:
          errorMsg = error.message || errorCode || 'Error desconocido.';
          break;
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

  /**
   * Redirección a la página de login
   * ¿Ya tenés una cuenta? <span class="login-button" (click)="goToLogin()"> Inicia sesión</span>
   */
  goToLogin() {
    this.router.navigate(['./login']);
  }
}
