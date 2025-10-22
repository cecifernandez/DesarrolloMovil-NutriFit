import { Component } from '@angular/core';
import { FirebaseService } from 'src/firebase.service';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
  standalone: false
})
export class ForgotPasswordPage {
  email: string = '';

  constructor(
    private firebaseService: FirebaseService,
    private toastCtrl: ToastController
  ) {}

  async resetPassword() {
    if (!this.email) {
      const toast = await this.toastCtrl.create({
        message: 'Por favor, ingresá tu correo electrónico.',
        duration: 2500,
        color: 'warning',
      });
      await toast.present();
      return;
    }

    try {
      await this.firebaseService.resetPassword(this.email);
      const toast = await this.toastCtrl.create({
        message: 'Correo enviado. Revisá tu bandeja de entrada.',
        duration: 3000,
        color: 'success',
      });
      await toast.present();
    } catch (error: any) {
      const toast = await this.toastCtrl.create({
        message: 'Error: ' + (error.message || 'No se pudo enviar el correo.'),
        duration: 3000,
        color: 'danger',
      });
      await toast.present();
    }
  }
}

