import { Component, ElementRef, ViewChild, AfterViewInit, OnInit } from '@angular/core';
import { Auth, onAuthStateChanged } from '@angular/fire/auth';
import type { User } from 'firebase/auth';
import { inject } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { Geolocation, Position } from '@capacitor/geolocation';
import { UserRegistrationService } from '@/app/services/user-registration.service';
import { CaloriesTrackingService } from '@/app/services/calories-tracking.service';


import { ExercisesService } from 'src/app/services/exercises.service';
import { AlertController, Platform } from '@ionic/angular';

Chart.register(...registerables);

interface ActivityData {
  distance: number;
  duration: number;
  calories: number;
  avgSpeed: number;
}

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})

export class HomePage implements AfterViewInit, OnInit {
  @ViewChild('caloriesCanvas') private caloriesCanvas!: ElementRef;
  greeting: string = '';
  chart: any;
  user: User | null = null;
  public userData: any = {};
  private auth: Auth;

  showPermissionModal = false;
  showHelpModal = false;

  selectedRoutines: any[] = [];
  public allCategories: any[] = [];

  isTracking = false;
  private watchId: string | null = null;
  private positions: Position[] = [];
  private startTime: number = 0;

  userWeight: number = 0;

  currentDistance = 0;
  currentDuration = 0;
  currentSpeed = 0;
  estimatedCalories = 0;

  activityResults: ActivityData | null = null;

  private statusInterval: any;

  private readonly CALORIE_FACTORS = {
    walking: 50,   
    jogging: 70,   
    running: 100,  
    cycling: 40    
  };



  constructor(
    private userService: UserRegistrationService,
    private caloriesService: CaloriesTrackingService,
    private exercisesService: ExercisesService,
    private alertCtrl: AlertController,
    private platform: Platform) {
    this.auth = inject(Auth);
  }

  async ngOnInit() {
    await this.userService.loadUserFromFirestore();
    this.userData = this.userService.getData();
    this.selectedRoutines = await this.exercisesService.getUserRoutines();
    this.userWeight = this.userData.weight ? this.userData.weight : 0;

    try {
      this.allCategories = await this.exercisesService.getUserRoutines();
    } catch (error) {
    }

    onAuthStateChanged(this.auth, (user) => {
      this.user = user;
    });

    this.setGreeting();
  }

  ngOnDestroy() {
    if (this.statusInterval) {
      clearInterval(this.statusInterval);
    }
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.createChart();
    }, 150);
  }

  /**
 * Devuelve la fecha actual en español con formato legible.
 *
 * Usa `toLocaleDateString('es-ES', ...)` para obtener algo como
 * "jueves, 30 de octubre" y luego capitaliza la primera letra.
 *
 * @returns {string} Fecha formateada, por ejemplo: "Jueves, 30 de octubre".
 */
  getTodayDate(): string {
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    };
    const today = new Date();
    const dateString = today.toLocaleDateString('es-ES', options);
    return dateString.charAt(0).toUpperCase() + dateString.slice(1);
  }

  /**
   * Define el saludo (`this.greeting`) según la hora del día.
   *
   * - 05:00 a 11:59 → "Buenos días"
   * - 12:00 a 19:59 → "Buenas tardes"
   * - 20:00 a 04:59 → "Buenas noches"
   *
   * @returns {void}
   */
  setGreeting(): void {
    const currentHour = new Date().getHours();

    if (currentHour >= 5 && currentHour < 12) {
      this.greeting = 'Buenos días';
    } else if (currentHour >= 12 && currentHour < 20) {
      this.greeting = 'Buenas tardes';
    } else {
      this.greeting = 'Buenas noches';
    }
  }

  /**
   * Crea el gráfico de calorías de los últimos 7 días.
   *
   * - Obtiene las etiquetas y los valores desde `caloriesService`.
   * - Calcula cuál fue el día con más calorías y lo pinta con un color destacado.
   * - Configura un gráfico de barras con Chart.js con tooltips personalizados,
   *   esquinas redondeadas y ejes minimalistas.
   *
   * @returns {void}
   */
  createChart(): void {
    const labels = this.caloriesService.getLast7DaysLabels();
    const dataValues = this.caloriesService.getWeeklyCalories();

    const maxValue = Math.max(...dataValues);
    const isMaxIndex = dataValues.map((v) => v === maxValue);

    const backgroundColors = isMaxIndex.map((isMax) =>
      isMax ? '#82D68E' : '#EAEAEA'
    );
    const textColors = isMaxIndex.map((isMax) => (isMax ? '#82D68E' : '#9e9e9e'));
    const fontWeights = isMaxIndex.map((isMax) =>
      isMax ? ('bold' as const) : ('normal' as const)
    );

    this.chart = new Chart(this.caloriesCanvas.nativeElement, {
      type: 'bar',
      data: {
        labels,
        datasets: [
          {
            data: dataValues,
            backgroundColor: backgroundColors,
            borderRadius: 8,
            borderSkipped: false,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            enabled: true,
            callbacks: {
              label: function (context) {
                return `${context.parsed.y} kcal`;
              },
            },
            backgroundColor: '#FFFFFF',
            titleColor: '#333333',
            bodyColor: '#333333',
            borderColor: '#E0E0E0',
            borderWidth: 1,
            cornerRadius: 10,
            displayColors: false,
          },
        },
        scales: {
          y: { display: false },
          x: {
            display: true,
            grid: { display: false },
            ticks: {
              color: (ctx) => textColors[ctx.index],
              font: (ctx) => ({ weight: fontWeights[ctx.index] }),
            },
          },
        },
      },
    });
  }

  /**
   * Solicita permisos de geolocalización al usuario.
   *
   * Llama a `Geolocation.requestPermissions()` y devuelve `true` si el permiso
   * fue otorgado. Si ocurre un error, lo loguea y devuelve `false`.
   *
   * @async
   * @returns {Promise<boolean>} `true` si se concedieron los permisos.
   */
  async getPermissions(): Promise<boolean> {
    try {
      const status = await Geolocation.requestPermissions();

      return status.location === 'granted';
    } catch (e) {
      return false;
    }
  }

  /**
   * Inicia el tracking de actividad física (caminar, correr, etc.).
   *
   * Flujo:
   * 1. Pide permisos de geolocalización.
   * 2. Reinicia variables de estado.
   * 3. Obtiene la primera posición.
   * 4. Inicia `watchPosition` para seguir recibiendo posiciones.
   * 5. Inicia un intervalo que cada segundo actualiza distancia, duración, velocidad y calorías.
   *
   * Si algo falla, muestra un mensaje de error.
   *
   * @async
   * @returns {Promise<void>}
   */
  async startActivity(): Promise<void> {
    try {
      const hasPermission = await this.getPermissions();
      if (!hasPermission) {
        alert('Necesitamos permisos de ubicación para rastrear tu actividad');
        return;
      }

      this.positions = [];
      this.startTime = Date.now();
      this.isTracking = true;
      this.activityResults = null;

      const initialPosition = await Geolocation.getCurrentPosition({
        enableHighAccuracy: true,
      });
      this.positions.push(initialPosition);

      this.watchId = await Geolocation.watchPosition(
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        },
        (position, err) => {
          if (err) {
            console.error('Error en watchPosition:', err);
            return;
          }

          if (position) {
            this.positions.push(position);
            
          }
        }
      );

      this.statusInterval = setInterval(() => {
        this.updateStatus();
      }, 1000);

    } catch (error) {
      alert('Error al iniciar el seguimiento');
    }
  }

  /**
   * Detiene el tracking de actividad y calcula los resultados finales.
   *
   * - Limpia el intervalo de estado.
   * - Detiene el `watchPosition`.
   * - Calcula distancia total, duración, velocidad promedio y calorías estimadas.
   * - Guarda las calorías del día en `caloriesService`.
   * - Limpia variables de la sesión.
   *
   * @async
   * @returns {Promise<void>}
   */
  async stopActivity(): Promise<void> {
    try {
      if (this.statusInterval) {
        clearInterval(this.statusInterval);
      }

      if (this.watchId) {
        await Geolocation.clearWatch({ id: this.watchId });
        this.watchId = null;
      }

      this.isTracking = false;

      const distance = this.calculateTotalDistance();
      const duration = (Date.now() - this.startTime) / 1000 / 60;
      const avgSpeed = duration > 0 ? (distance / duration) * 60 : 0;
      const calories = this.calculateCalories(distance, avgSpeed);

      this.activityResults = {
        distance: distance,
        duration: duration,
        avgSpeed: avgSpeed,
        calories: calories,
      };


      this.caloriesService.saveDailyCalories(calories);

      this.positions = [];
      this.startTime = 0;
    } catch (error) {
      console.error('Error deteniendo actividad:', error);
    }
  }

  /**
   * Actualiza las métricas actuales de la actividad en curso.
   *
   * Calcula distancia, duración, velocidad y calorías estimadas y las asigna
   * a propiedades públicas para que la vista se actualice.
   *
   * @private
   * @returns {void}
   */
  private updateStatus(): void {
    const distance = this.calculateTotalDistance();
    const duration = (Date.now() - this.startTime) / 1000 / 60;

    this.currentDistance = distance;
    this.currentDuration = duration;
    this.currentSpeed = duration > 0 ? (distance / duration) * 60 : 0;
    this.estimatedCalories = this.calculateCalories(
      distance,
      this.currentSpeed
    );
  }

  /**
   * Calcula la distancia total recorrida usando las posiciones almacenadas.
   *
   * Recorre el array de posiciones y aplica la fórmula de Haversine entre cada
   * par consecutivo. Filtra lecturas irreales (>100m entre muestras).
   *
   * @private
   * @returns {number} Distancia total en km.
   */
  private calculateTotalDistance(): number {
    if (this.positions.length < 2) {
      return 0;
    }

    let totalDistance = 0;

    for (let i = 1; i < this.positions.length; i++) {
      const distance = this.haversineDistance(
        this.positions[i - 1].coords.latitude,
        this.positions[i - 1].coords.longitude,
        this.positions[i].coords.latitude,
        this.positions[i].coords.longitude
      );

      if (distance < 0.1) {
        totalDistance += distance;
      }
    }

    return totalDistance;
  }

  /**
   * Calcula la distancia entre dos puntos (lat/lon) usando la fórmula de Haversine.
   *
   * @private
   * @param {number} lat1 - Latitud del primer punto.
   * @param {number} lon1 - Longitud del primer punto.
   * @param {number} lat2 - Latitud del segundo punto.
   * @param {number} lon2 - Longitud del segundo punto.
   * @returns {number} Distancia en km.
   */
  private haversineDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number {
    const R = 6371;
    const dLat = this.toRad(lat2 - lat1);
    const dLon = this.toRad(lon2 - lon1);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRad(lat1)) *
      Math.cos(this.toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;

    return distance;
  }

  /**
   * Convierte grados a radianes.
   *
   * @private
   * @param {number} degrees - Valor en grados.
   * @returns {number} Valor en radianes.
   */
  private toRad(degrees: number): number {
    return degrees * (Math.PI / 180);
  }

  /**
   * Calcula las calorías estimadas en función de la distancia y la velocidad.
   *
   * Usa factores diferentes según el tipo de actividad detectada (caminar, trotar,
   * correr, ciclismo) y ajusta por el peso del usuario.
   *
   * @private
   * @param {number} distance - Distancia recorrida en km.
   * @param {number} speed - Velocidad promedio en km/h.
   * @returns {number} Calorías aproximadas quemadas.
   */
  private calculateCalories(distance: number, speed: number): number {
    let factor = 50;

    if (speed < 5) factor = this.CALORIE_FACTORS.walking;
    else if (speed < 8) factor = this.CALORIE_FACTORS.jogging;
    else if (speed < 20) factor = this.CALORIE_FACTORS.running;
    else factor = this.CALORIE_FACTORS.cycling;

    const weightFactor = this.userWeight / 70;
    const calories = distance * factor * weightFactor;

    return Math.round(calories);
  }

  /**
   * Formatea un tiempo en minutos decimales a `mm:ss`.
   *
   * @param {number} minutes - Tiempo en minutos (puede ser decimal).
   * @returns {string} Tiempo formateado, por ejemplo "5:07".
   */
  formatTime(minutes: number): string {
    const mins = Math.floor(minutes);
    const secs = Math.floor((minutes - mins) * 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }

  /**
   * Formatea una distancia en km a una cadena amigable.
   *
   * - Si es menos de 1 km → muestra en metros.
   * - Si es 1 km o más → muestra con 2 decimales.
   *
   * @param {number} km - Distancia en kilómetros.
   * @returns {string} Distancia formateada.
   */
  formatDistance(km: number): string {
    if (km < 1) {
      return `${Math.round(km * 1000)} m`;
    }
    return `${km.toFixed(2)} km`;
  }

  /**
   * Devuelve el tipo de actividad según la velocidad.
   *
   * - < 5 km/h → Caminata
   * - < 8 km/h → Trote
   * - < 20 km/h → Carrera
   * - >= 20 km/h → Ciclismo
   *
   * @param {number} speed - Velocidad en km/h.
   * @returns {string} Tipo de actividad.
   */
  getActivityType(speed: number): string {
    if (speed < 5) return 'Caminata';
    if (speed < 8) return 'Trote';
    if (speed < 20) return 'Carrera';
    return 'Ciclismo';
  }

  /**
   * Reinicia el estado de la actividad para poder comenzar una nueva.
   *
   * Simplemente limpia `activityResults` para que la vista muestre de nuevo
   * el estado inicial.
   *
   * @returns {void}
   */
  newActivity(): void {
    this.activityResults = null;
  }

  /**
   * Obtiene la posición actual del dispositivo una sola vez.
   *
   * Usa `Geolocation.getCurrentPosition(...)` con alta precisión. Si falla,
   * devuelve `null`.
   *
   * @async
   * @returns {Promise<Position | null>} Posición actual o `null` si hubo error.
   */
  async getCurrentPosition(): Promise<Position | null> {
    try {
      const coordinates = await Geolocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 10000,
      });
      return coordinates;
    } catch (e) {
      console.error('Error getting location', e);
      return null;
    }
  }

  /**
   * Alterna entre iniciar y detener la actividad.
   *
   * - Si ya se está trackeando (`isTracking === true`), detiene.
   * - Si no, muestra el modal de permisos personalizado.
   *
   * @async
   * @returns {Promise<void>}
   */
  async onToggleActivity(): Promise<void> {
    if (this.isTracking) {
      await this.stopActivity();
    } else {
      this.showPermissionModal = true;
    }
  }

  /**
   * Cierra el modal personalizado de permisos.
   *
   * @returns {void}
   */
  closePermissionModal(): void {
    this.showPermissionModal = false;
  }

  /**
   * Maneja la confirmación del modal de permisos.
   *
   * Oculta el modal y dispara nuevamente la solicitud de permisos del dispositivo.
   * (Acá podrías también llamar directamente a `startActivity()` si querés encadenar).
   *
   * @async
   * @returns {Promise<void>}
   */
  async onConfirmPermission(): Promise<void> {
    this.showPermissionModal = false;
    await this.getPermissions();
  }

}
