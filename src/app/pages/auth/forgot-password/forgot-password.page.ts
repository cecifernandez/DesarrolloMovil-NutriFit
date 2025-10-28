import { Component } from '@angular/core';
import { FirebaseService } from '@/app/services/firebase.service';
import { ToastController } from '@ionic/angular';
import { ButtonText } from '@/app/enum/button-text/button-text';
import { InputText } from '@/app/enum/input-text/input-text';
import { LoginForm } from '@/app/models/login.models';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
  standalone: false
})
export class ForgotPasswordPage {
  email: string = '';
  ButtonText = ButtonText;
  ButtonInputEmail = InputText;

  input: LoginForm = {
    email: '',
    password: ''
  };

  constructor(
    private firebaseService: FirebaseService,
    private toastCtrl: ToastController,
    private router: Router
  ) {}

   /**
   * Verifica si el usuario ya está autenticado al iniciar el componente.
   *
   * Si hay una sesión activa, redirige automáticamente al usuario a la ruta definida
   * (por defecto, '/home'), evitando que acceda a pantallas públicas como Welcome.
   *
   * @returns {void}
  */
  ngOnInit() { 
    this.firebaseService.redirectIfAuthenticated(this.router);
  }

  goToLogin() {
    this.router.navigate(['./login']);
  }

  async resetPassword() {
    if (!this.email) {
      const toast = await this.toastCtrl.create({
        message: 'Por favor, ingresá tu correo electrónico.',
        duration: 2500,
        color: 'warning',
        position: "bottom"
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
        position: "bottom"
      });
      await toast.present();
    } catch (error: any) {
      const toast = await this.toastCtrl.create({
        message: 'Error: ' + (error.message || 'No se pudo enviar el correo.'),
        duration: 3000,
        color: 'danger',
        position: "bottom"
      });
      await toast.present();
    }
  }
}

