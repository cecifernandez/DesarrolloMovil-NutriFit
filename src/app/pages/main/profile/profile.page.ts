import { Component, ElementRef, ViewChild, AfterViewInit, OnInit } from '@angular/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { UserRegistrationService } from '@/app/services/user-registration.service';
import { ButtonText } from '@/app/enum/button-text/button-text';
import { FirebaseService } from '@/app/services/firebase.service';
import { Auth } from '@angular/fire/auth';
import { Firestore, doc, getDoc } from '@angular/fire/firestore';
import { UserProfile } from '@/app/interfaces/user-profile.interface';
import { Observable } from 'rxjs';
import { Chart, registerables } from 'chart.js';
import { CaloriesTrackingService } from '@/app/services/calories-tracking.service';
import { ExercisesService } from 'src/app/services/exercises.service';
Chart.register(...registerables);


@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: false
})
export class ProfilePage implements OnInit {
  @ViewChild('caloriesCanvas') private caloriesCanvas!: ElementRef;

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
  ) { }

  async ngOnInit() {
    this.loadUserData();
    try {
        const userRoutines = await this.exercisesService.getUserRoutines(); // desde Firebase
        if (userRoutines && userRoutines.length > 0) {
          // Mostrar solo las seleccionadas
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
  async setActiveTab(tab: 'rutinas' | 'estadisticas') {
    console.log('Tab cambiado a:', tab);
    this.activeTab = tab;

    if (tab === 'estadisticas') {
      // Si el gráfico ya existe, no lo volvemos a crear
      if (this.chart) {
        return;
      }

      // 1. Obtenemos los datos para el gráfico (últimas 4 semanas)
      // Puedes cambiar el '4' por el número de semanas que quieras ver
      const chartData = this.caloriesService.getCaloriesForPastWeeks(4);

      // 2. Obtenemos el total de los últimos 7 días para mostrarlo como texto
      this.totalLast7Days = this.caloriesService.getTotalWeeklyCalories();

      // 3. Creamos el gráfico (con el setTimeout como lo tenías)
      setTimeout(() => {
        // Pasamos los datos de las semanas al gráfico
        this.createChart(chartData.labels, chartData.data);
      }, 0); // 0ms es suficiente

    } else {
      // Si cambiamos a 'rutinas', destruimos el gráfico
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
        const userRoutines = await this.exercisesService.getUserRoutines(); // desde Firebase
        if (userRoutines && userRoutines.length > 0) {
          // Mostrar solo las seleccionadas
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

    // 1) Encontrar el valor máximo para destacarlo
    // Usamos '...dataValues, 0' para que si el array está vacío, el máximo no sea -Infinity
    const maxValue = Math.max(...dataValues, 0);

    // Comprobamos si hay algún dato real (mayor que 0)
    const hasData = dataValues.some(v => v > 0);

    // Creamos un array que marca cuál es el índice del valor máximo
    // Solo marca si 'hasData' es true y el valor es el máximo
    const isMaxIndex = dataValues.map(v => hasData && v === maxValue);

    // 2) Colores y fuentes dinámicas según si es el máximo o no
    const backgroundColors = isMaxIndex.map(isMax => isMax ? '#82D68E' : '#EAEAEA');
    const textColors = isMaxIndex.map(isMax => isMax ? '#82D68E' : '#9e9e9e');
    const fontWeights = isMaxIndex.map(isMax => isMax ? 'bold' as const : 'normal' as const);

    // 3) Comprobar si el canvas existe antes de dibujar
    if (!this.caloriesCanvas || !this.caloriesCanvas.nativeElement) {
      console.error('Error: El elemento <canvas> no se encontró al crear el gráfico.');
      return;
    }

    // 4) Crear la instancia del gráfico
    this.chart = new Chart(this.caloriesCanvas.nativeElement, {
      type: 'bar',
      data: {
        labels: labels, // Usamos el parámetro
        datasets: [{
          data: dataValues, // Usamos el parámetro
          backgroundColor: backgroundColors,
          borderRadius: 8,
          borderSkipped: false
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          // Oculta la leyenda del dataset
          legend: {
            display: false
          },
          // Configuración avanzada del tooltip (el popup al hacer hover)
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
          // Ocultamos el eje Y (el de los números)
          y: {
            display: false
          },
          // Configuramos el eje X (el de las semanas)
          x: {
            display: true,
            grid: {
              display: false // Sin líneas de cuadrícula
            },
            ticks: {
              // Asignamos el color y grosor de fuente a cada etiqueta
              color: (ctx) => textColors[ctx.index],
              font: (ctx) => ({ weight: fontWeights[ctx.index] })
            }
          }
        }
      }
    });
  }



}
