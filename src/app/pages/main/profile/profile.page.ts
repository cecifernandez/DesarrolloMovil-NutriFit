import { Component, OnInit } from '@angular/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

import { UserService } from '@/app/services/user';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: false
})
export class ProfilePage implements OnInit {
  profileImage: string = 'https://ionicframework.com/docs/img/demos/avatar.svg';

  genero: string = '';
  peso: string | null = null;
  altura: string = '';

  constructor(private userService: UserService) { }

  ngOnInit() {
    const user = this.userService.getUser();
    this.genero = user.genero;
    this.peso = user.peso;
    this.altura = user.altura;
  }

  /**
 * Abre la cámara o galería del dispositivo para permitir al usuario seleccionar o tomar
 * una nueva foto de perfil. Si la acción es exitosa, actualiza la imagen en pantalla.
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
}
