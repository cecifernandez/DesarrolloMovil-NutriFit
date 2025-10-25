import { Component, OnInit } from '@angular/core';

import { ButtonText } from '@/app/enum/button-text/button-text';
import { Router } from '@angular/router';
import { FirebaseService } from '@/app/services/firebase.service';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'welcome-nutri-fit',
  templateUrl: './welcome-nutri-fit.page.html',
  styleUrls: ['./welcome-nutri-fit.page.scss'],
  standalone: false
})
export class WelcomeNutriFitPage implements OnInit {
  ButtonText = ButtonText;

  goToLoginWithEmail() {
    this.router.navigate(['./login']);
  }

  goToRegister() {
    this.router.navigate(['./register']);
  }

  constructor(
    private router: Router,
    private firebaseService: FirebaseService,
    private toastController: ToastController
  ) { }

  /**
   * Verifica si el usuario ya está autenticado al iniciar el componente.
   *
   * Si hay una sesión activa, redirige automáticamente al usuario a la ruta definida
   * (por defecto, '/home'), evitando que acceda a pantallas públicas como Welcome.
   *
   * @returns {void}
  */
  ngOnInit() { 
    //this.firebaseService.redirectIfAuthenticated(this.router);
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
      // const isNewUser = result.additionalUserInfo?.isNewUser;

      // // Determina la ruta a la que se redirige
      // const route = isNewUser ? '/about-you' : '/home';
      // await this.router.navigateByUrl(route, { replaceUrl: true });

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