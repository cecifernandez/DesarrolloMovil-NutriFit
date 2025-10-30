import { Component, ElementRef, ViewChild, AfterViewInit, OnInit } from '@angular/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { UserRegistrationService } from '@/app/services/user-registration.service';
import { FirebaseService } from '@/app/services/firebase.service';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';import { ButtonText } from '@/app/enum/button-text/button-text';
import { Auth } from '@angular/fire/auth';
import { Firestore, doc, getDoc } from '@angular/fire/firestore';
import { UserProfile } from '@/app/interfaces/user-profile.interface';
import { Observable } from 'rxjs';
import { Chart, registerables } from 'chart.js';
import { CaloriesTrackingService } from '@/app/services/calories-tracking.service';
import { ExercisesService } from 'src/app/services/exercises.service';
import { ModalController } from '@ionic/angular';
Chart.register(...registerables);


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
  @ViewChild('caloriesCanvas') private caloriesCanvas!: ElementRef;

  profileImage: string = 'https://ionicframework.com/docs/img/demos/avatar.svg';

  /**
   * Datos del usuario obtenidos desde el servicio de registro.
   * Contiene nombre, género, peso y altura.
   * @type {{ name: string; gener: string; weight: number; height: number }}
   */
  dataUser = {
    name: '',
    gender: 'Otro',
    weight: 0,
    height: 0
  }


  activeTab: 'rutinas' | 'estadisticas' = 'rutinas';

  ButtonText = ButtonText;

  users$: Observable<any[]> | null = null;

  chart: any;
  totalLast7Days: number = 0;


  public selectedRoutines: any[] = [];
  public allCategories: any[] = [];


  constructor(
    private userRegistrationService: UserRegistrationService,
    private firebaseService: FirebaseService,
    private firestore: Firestore,
    private auth: Auth,
    private caloriesService: CaloriesTrackingService,
    private exercisesService: ExercisesService,
    private toastController: ToastController,
    private router: Router,
    private modalCtrl: ModalController
  ) { }

  async ngOnInit() {
    this.loadUserData();
    try {
        const userRoutines = await this.exercisesService.getUserRoutines();
        if (userRoutines && userRoutines.length > 0) {
          
          this.selectedRoutines = userRoutines.filter(r => r.selected);
        }
      } catch (error) {
        console.error('Error al cargar rutinas en Profile:', error);
      }
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
        weight: user.weight ?? 0,
        height: user.height ?? 0,
      };
    }
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
  /**
    * Cambia entre las pestañas "Mis rutinas" y "Estadísticas"
    */
  async setActiveTab(tab: 'rutinas' | 'estadisticas') {
    this.activeTab = tab;

    if (tab === 'estadisticas') {
  
      if (this.chart) {
        return;
      }

     
      const chartData = this.caloriesService.getCaloriesForPastWeeks(4);

    
      this.totalLast7Days = this.caloriesService.getTotalWeeklyCalories();

     
      setTimeout(() => {
  
        this.createChart(chartData.labels, chartData.data);
      }, 0); 
    } else {
      
      if (this.chart) {
        this.chart.destroy();
        this.chart = null;
      }
    }
    if (tab === 'rutinas') {
      if (this.chart) {
        this.chart.destroy();
        this.chart = null;
      }


      try {
        const userRoutines = await this.exercisesService.getUserRoutines(); 
        if (userRoutines && userRoutines.length > 0) {
        
          this.selectedRoutines = userRoutines.filter(r => r.selected);
        }
      } catch (error) {
        console.error('Error al cargar rutinas en Profile:', error);
      }


    }
  }

  /**
 * Crea el gráfico de barras de calorías semanales.
 * Esta función es llamada por 'setActiveTab' cuando se cambia a 'estadisticas'.
 *
 * @param labels - Un array de strings para el eje X (ej. "Oct 20 - 26").
 * @param dataValues - Un array de números con el total de kcal para cada semana.
 */
  createChart(labels: string[], dataValues: number[]) {

    
    const maxValue = Math.max(...dataValues, 0);

 
    const hasData = dataValues.some(v => v > 0);

    
    const isMaxIndex = dataValues.map(v => hasData && v === maxValue);

    
    const backgroundColors = isMaxIndex.map(isMax => isMax ? '#82D68E' : '#EAEAEA');
    const textColors = isMaxIndex.map(isMax => isMax ? '#82D68E' : '#9e9e9e');
    const fontWeights = isMaxIndex.map(isMax => isMax ? 'bold' as const : 'normal' as const);

   
    if (!this.caloriesCanvas || !this.caloriesCanvas.nativeElement) {
      console.error('Error: El elemento <canvas> no se encontró al crear el gráfico.');
      return;
    }

 
    this.chart = new Chart(this.caloriesCanvas.nativeElement, {
      type: 'bar',
      data: {
        labels: labels, 
        datasets: [{
          data: dataValues, 
          backgroundColor: backgroundColors,
          borderRadius: 8,
          borderSkipped: false
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          
          legend: {
            display: false
          },
         
          tooltip: {
            enabled: true,
            callbacks: {
              label: function (context) {
                return `${context.parsed.y} kcal`;
              }
            },
            backgroundColor: '#FFFFFF',
            titleColor: '#333333',
            bodyColor: '#333333',
            borderColor: '#E0E0E0',
            borderWidth: 1,
            cornerRadius: 10,
            displayColors: false
          }
        },
        scales: {
          
          y: {
            display: false
          },
          
          x: {
            display: true,
            grid: {
              display: false 
            },
            ticks: {
              
              color: (ctx) => textColors[ctx.index],
              font: (ctx) => ({ weight: fontWeights[ctx.index] })
            }
          }
        }
      }
    });
  }

  /**
 * Navega a la pantalla de edición de perfil del usuario.
 *
 * Se usa, por ejemplo, desde el perfil para que el usuario pueda modificar
 * su nombre, peso, contraseña u otros datos.
 *
 * @returns {void}
 */
goToEditProfile(): void {
  this.router.navigate(['/edit-profile']);
}

}
