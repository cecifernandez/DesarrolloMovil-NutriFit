import { Component, OnInit } from '@angular/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { UserRegistrationService } from '@/app/services/user-registration.service';
import { ButtonText } from '@/app/enum/button-text/button-text';
 import { FirebaseService } from '@/firebase.service';
 import { Auth } from '@angular/fire/auth'; 
 import { Firestore, doc, getDoc } from '@angular/fire/firestore';
import { UserProfile } from '@/app/interfaces/user-profile.interface';
import { Observable } from 'rxjs';


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
    gender: 'Otro',
    weight: 0,
    height: 0
  }

  activeTab: 'rutinas' | 'estadisticas' = 'rutinas';

  ButtonText = ButtonText;
  
  users$: Observable<any[]> | null = null;

  constructor(
    private userRegistrationService: UserRegistrationService,
    private firebaseService: FirebaseService,
    private firestore: Firestore,   
    private auth: Auth              
  ) {}

  ngOnInit() {
    this.loadUserData();
}

/**
 * Carga los datos del usuario autenticado desde Firebase Firestore.
 * 
 * Este método obtiene el UID del usuario actualmente autenticado mediante el servicio
 * de autenticación de Firebase (`Auth`), consulta el documento correspondiente en la
 * colección `users` de Firestore y, si existe, actualiza la propiedad local `dataUser`
 * del componente con la información recuperada.
 * 
 * Flujo general:
 * 1. Verifica si existe un usuario autenticado (`this.auth.currentUser`).
 * 2. Obtiene una referencia al documento del usuario en la colección `users` usando su `uid`.
 * 3. Recupera el documento con `getDoc()`.
 * 4. Si el documento existe, convierte los datos al tipo `UserProfile`.
 * 5. Actualiza el estado local del componente (`dataUser`) con los datos del usuario.
 * 
 * @async
 * @returns {Promise<void>} Una promesa que se resuelve cuando los datos han sido cargados.
 * 
 * @throws {Error} Si ocurre un problema al comunicarse con Firestore.
 * 
 * @example
 * // Uso dentro de ngOnInit
 * ngOnInit() {
 *   this.loadUserData();
 * }
 */

async loadUserData() {
  const uid = this.auth.currentUser?.uid;
  if (!uid) return;
  
  

  const userRef = doc(this.firestore, `users/${uid}`);
  const docSnap = await getDoc(userRef);

  if (docSnap.exists()) {
    const user = docSnap.data() as UserProfile;
    
    this.dataUser = {
      name: user.username,
      gender: user.gender,
      weight:  user.weight ?? 0,
      height: user.height ?? 0,  
    };
  }
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
    /**
   * Cambia entre las pestañas "Mis rutinas" y "Estadísticas"
   */
  setActiveTab(tab: 'rutinas' | 'estadisticas') {
     console.log('Tab cambiado a:', tab);
    this.activeTab = tab;
  }
  
}
