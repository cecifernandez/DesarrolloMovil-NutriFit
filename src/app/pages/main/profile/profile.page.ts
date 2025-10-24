import { Component, OnInit } from '@angular/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { UserRegistrationService } from '@/app/services/user-registration.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: false
})
export class ProfilePage implements OnInit {
  profileImage: string = 'https://ionicframework.com/docs/img/demos/avatar.svg';

  dataUser = {
    name: '',
    gener: '',
    weight: 0,
    height: 0
  }

  constructor(private userRegistrationService: UserRegistrationService) { }

  ngOnInit() {
    const user = this.userRegistrationService.getData();
    this.dataUser.name = user.username ? user.username : 'Usuario'
    this.dataUser.gener = user.gender ? user.gender : '';
    this.dataUser.weight = user.weight ? user.weight : 0;
    this.dataUser.height = user.height ? user.height : 0;
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
