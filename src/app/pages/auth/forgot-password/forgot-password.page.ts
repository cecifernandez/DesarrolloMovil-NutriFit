import { Component } from '@angular/core';
import { FirebaseService } from '@/app/services/firebase.service';
import { ToastController } from '@ionic/angular';
import { ButtonText } from '@/app/enum/button-text/button-text';
import { InputText } from '@/app/enum/input-text/input-text';
import { LoginForm } from '@/app/models/login.models';
import { Router } from '@angular/router';

/**
 * Componente para la pantalla de recuperación de contraseña.
 * Permite al usuario solicitar un correo para restablecer su contraseña.
 */
@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
  standalone: false
})
export class ForgotPasswordPage {

  /** Enum con los textos de los botones */
  ButtonText = ButtonText;

  /** Enum con las configuraciones de input para email */
  ButtonInputEmail = InputText;

   /** Modelo del formulario de login con email y password */
  input: LoginForm = {
    email: '',
    password: ''
  };

  /**
   * Constructor del componente.
   * @param firebaseService Servicio para autenticación con Firebase.
   * @param toastCtrl Controlador para mostrar toasts.
   * @param router Servicio de ruteo para navegación.
   */
  constructor(
    private firebaseService: FirebaseService,
    private toastCtrl: ToastController,
    private router: Router
  ) {}

  /**
   * Hook de inicialización del componente.
   * Redirige al usuario si ya está autenticado.
   */
  ngOnInit() { 
    this.firebaseService.redirectIfAuthenticated(this.router);
  }

  /**
   * Navega a la pantalla de login.
   */
  goToLogin() {
    this.router.navigate(['./login']);
  }

  /**
   * Envía un correo de recuperación de contraseña si el email es válido.
   * Muestra mensajes de éxito o error mediante toasts.
   */
  async resetPassword() {
    if (!this.input.email) {
      const toast = await this.toastCtrl.create({
        message: 'Por favor, ingresá tu correo electrónico.',
        duration: 2500,
        color: 'warning',
        position: 'bottom'
      });
      await toast.present();
      return;
    }

    try {
      await this.firebaseService.resetPassword(this.input.email);

      const toast = await this.toastCtrl.create({
        message: 'Correo enviado. Revisá tu bandeja de entrada.',
        duration: 3000,
        color: 'success',
        position: 'bottom'
      });
      await toast.present();

    } catch (error: any) {
      const toast = await this.toastCtrl.create({
        message: 'Error: ' + (error.message || 'No se pudo enviar el correo.'),
        duration: 3000,
        color: 'danger',
        position: 'bottom'
      });
      await toast.present();
    }
  }
}