import { Component, OnInit } from '@angular/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { UserRegistrationService } from '@/app/services/user-registration.service';
import { FirebaseService } from '@/firebase.service';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: false
})
export class ProfilePage implements OnInit {
  /**
   * URL de la imagen de perfil actual del usuario.
   * Si no se ha seleccionado ninguna, se muestra una imagen por defecto.
   * @type {string}
   */
  profileImage: string = 'https://ionicframework.com/docs/img/demos/avatar.svg';

  /**
   * Datos del usuario obtenidos desde el servicio de registro.
   * Contiene nombre, género, peso y altura.
   * @type {{ name: string; gener: string; weight: number; height: number }}
   */
  dataUser = {
    name: '',
    gener: '',
    weight: 0,
    height: 0
  }

  /**
   * Inyecta los servicios necesarios para la gestión del perfil:
   * - `UserRegistrationService` para acceder a los datos del usuario local.
   * - `FirebaseService` para autenticación y cierre de sesión.
   * - `Router` para la navegación entre páginas.
   * - `ToastController` para mostrar notificaciones al usuario.
   */
  constructor(
    private userRegistrationService: UserRegistrationService,
    private firebaseService: FirebaseService,
    private router: Router,
    private toastController: ToastController
  ) { }

  /**
   * Inicializa los datos del usuario al cargar la vista del perfil.
   * Obtiene la información almacenada localmente mediante `UserRegistrationService`.
   *
   * @returns {void}
   */
  ngOnInit() {
    const user = this.userRegistrationService.getData();
    this.dataUser.name = user.username ? user.username : 'Usuario'
    this.dataUser.gener = user.gender ? user.gender : '';
    this.dataUser.weight = user.weight ? user.weight : 0;
    this.dataUser.height = user.height ? user.height : 0;
  }

  /**
   * Abre la cámara o la galería del dispositivo para permitir al usuario
   * seleccionar o tomar una nueva foto de perfil.
   *
   * Si la acción es exitosa, actualiza la imagen mostrada en la interfaz.
   *
   * @async
   * @returns {Promise<void>} Promesa que se resuelve cuando la foto ha sido seleccionada o tomada.
   */
  async changeProfilePhoto() {
    console.log('Evento click detectado');
    if (!Camera) {
      alert('La cámara no está disponible en este entorno.');
      return;
    }
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: true,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Prompt,
      });

      console.log('Imagen seleccionada:', image);

      this.profileImage = image.dataUrl!;
    } catch (error) {
      console.error('Error al tomar/seleccionar la foto:', error);
    }
  }

  /**
   * Cierra la sesión del usuario actual utilizando Firebase Authentication.
   * 
   * Muestra un mensaje de confirmación si el cierre es exitoso,
   * o un mensaje de error si ocurre algún problema durante el proceso.
   *
   * @async
   * @returns {Promise<void>} Promesa que se resuelve tras cerrar la sesión y redirigir al login.
   */
  async logoutUser() {
    try {
      await this.firebaseService.logout();

      const toast = await this.toastController.create({
        message: 'Sesión cerrada correctamente.',
        duration: 2000,
        color: 'medium'
      });
      await toast.present();

      // Redirigir al welcome
      this.router.navigate(['/']);
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      const toast = await this.toastController.create({
        message: 'Error al cerrar sesión. Intenta nuevamente.',
        duration: 2000,
        color: 'danger'
      });
      await toast.present();
    }
  }
}
