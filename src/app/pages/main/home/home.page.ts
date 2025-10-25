import { Component, ElementRef, ViewChild, AfterViewInit, OnInit } from '@angular/core';
import { Auth, onAuthStateChanged } from '@angular/fire/auth';
import type { User } from 'firebase/auth';
import { inject } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { Geolocation, Position } from '@capacitor/geolocation';
import { UserRegistrationService } from '@/app/services/user-registration.service';
import { CaloriesTrackingService } from '@/app/services/calories-tracking.service';


// IMPORTAR el servicio (descomentar cuando se una con el código del Home)
import { ExercisesService } from 'src/app/services/exercises.service'; 

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

  selectedRoutines: any[] = [];
  public allCategories: any[] = [];

  // Estado del tracking
  isTracking = false;
  private watchId: string | null = null;
  private positions: Position[] = [];
  private startTime: number = 0;

  // Configuración del usuario
  userWeight: number = 0;

  // Datos en tiempo real
  currentDistance = 0;
  currentDuration = 0;
  currentSpeed = 0;
  estimatedCalories = 0;

  // Resultados finales
  activityResults: ActivityData | null = null;

  private statusInterval: any;

  // Factores de calorías por km según actividad
  private readonly CALORIE_FACTORS = {
    walking: 50,   // < 5 km/h
    jogging: 70,   // 5-8 km/h
    running: 100,  // > 8 km/h
    cycling: 40    // > 20 km/h
  };

  // Este código permite que los ejercicios seleccionados en la tab de Rutinas
  // se reflejen automáticamente en el Home cuando hagamos el merge.
  // Descomentar e integrar cuando estemos trabajando sobre el .ts correspondiente.

  // Acá se van a guardar los ejercicios seleccionados por rutina
  /** selectedExercises: any = {}; */

  // Inyectar el servicio (ajustar según el constructor existente)
  /** constructor(private exercisesService: ExercisesService) {} */

  constructor(private userService: UserRegistrationService, private caloriesService: CaloriesTrackingService, private exercisesService: ExercisesService) { 
    this.auth = inject(Auth); 
  }

  async ngOnInit() {
    await this.userService.loadUserFromFirestore();
    this.userData = this.userService.getData();
    console.log('Datos del usuario cargados en Home:', this.userData);
    this.selectedRoutines = await this.exercisesService.getUserRoutines();
    console.log('Rutinas cargadas desde Firebase:', this.selectedRoutines);
    this.userWeight = this.userData.weight ? this.userData.weight : 0;
    // Escucha los cambios desde la tab de rutinas
     
      // this.exercisesService.selectedExercises$.subscribe(data => {
      //   this.selectedExercises = data;
      //   console.log('Ejercicios actualizados desde Rutinas:', data);
      // });
     
      try {
      this.allCategories = await this.exercisesService.getUserRoutines(); 
      console.log('Categorías cargadas para el creador:', this.allCategories);
    } catch (error) {
      console.error('Error al cargar las categorías de ejercicios', error);
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

  getTodayDate(): string {
    const options: Intl.DateTimeFormatOptions = { weekday: 'long', month: 'long', day: 'numeric' };
    const today = new Date();
    const dateString = today.toLocaleDateString('es-ES', options);
    return dateString.charAt(0).toUpperCase() + dateString.slice(1);
  }

  setGreeting() {
    const currentHour = new Date().getHours();

    if (currentHour >= 5 && currentHour < 12) {
      this.greeting = 'Buenos días'; // Mañana ☀️
    } else if (currentHour >= 12 && currentHour < 20) {
      this.greeting = 'Buenas tardes'; // Tarde 🌤️
    } else {
      this.greeting = 'Buenas noches'; // Noche 🌙
    }
  }

  createChart() {
    // Datos para el gráfico
    const labels = this.caloriesService.getLast7DaysLabels();
    const dataValues = this.caloriesService.getWeeklyCalories();

    // 1) Encontrar el/los máximos
    const maxValue = Math.max(...dataValues);
    const isMaxIndex = dataValues.map(v => v === maxValue);

    // 2) Colores dinámicos según si es máximo o no
    const backgroundColors = isMaxIndex.map(isMax => isMax ? '#82D68E' : '#EAEAEA');
    const textColors = isMaxIndex.map(isMax => isMax ? '#82D68E' : '#9e9e9e');
    const fontWeights = isMaxIndex.map(isMax => isMax ? 'bold' as const : 'normal' as const);

    this.chart = new Chart(this.caloriesCanvas.nativeElement, {
      type: 'bar',
      data: {
        labels,
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
          legend: { display: false },
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
          y: { display: false },
          x: {
            display: true,
            grid: { display: false },
            ticks: {
              color: (ctx) => textColors[ctx.index],
              font: (ctx) => ({ weight: fontWeights[ctx.index] })
            }
          }
        }
      }
    });
  }


  async getPermissions(): Promise<boolean> {
    try {
      const status = await Geolocation.requestPermissions();
      console.log('Geolocation permission status:', status);

      return status.location === 'granted';
    } catch (e) {
      console.error('Error requesting location permissions', e);
      return false;
    }
  }

  //TRACKING DE ACTIVIDAD

  async startActivity() {
    try {
      const hasPermission = await this.getPermissions();
      if (!hasPermission) {
        alert('Necesitamos permisos de ubicación para rastrear tu actividad');
        return;
      }

      // Reiniciar variables
      this.positions = [];
      this.startTime = Date.now();
      this.isTracking = true;
      this.activityResults = null;

      // Obtener posición inicial
      const initialPosition = await Geolocation.getCurrentPosition({
        enableHighAccuracy: true
      });
      this.positions.push(initialPosition);
      console.log('Posición inicial:', initialPosition.coords);

      // Iniciar seguimiento continuo
      this.watchId = await Geolocation.watchPosition(
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        },
        (position, err) => {
          if (err) {
            console.error('Error en watchPosition:', err);
            return;
          }

          if (position) {
            this.positions.push(position);
            console.log('Nueva posición:', {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
              total: this.positions.length
            });
          }
        }
      );

      // Actualizar estado cada segundo
      this.statusInterval = setInterval(() => {
        this.updateStatus();
      }, 1000);

      console.log('Seguimiento iniciado');

    } catch (error) {
      console.error('Error iniciando actividad:', error);
      alert('Error al iniciar el seguimiento');
    }
  }

  async stopActivity() {
    try {
      // Limpiar interval
      if (this.statusInterval) {
        clearInterval(this.statusInterval);
      }

      // Detener el watch
      if (this.watchId) {
        await Geolocation.clearWatch({ id: this.watchId });
        this.watchId = null;
      }

      this.isTracking = false;

      // Calcular resultados finales
      const distance = this.calculateTotalDistance();
      const duration = (Date.now() - this.startTime) / 1000 / 60; // minutos
      const avgSpeed = duration > 0 ? (distance / duration) * 60 : 0; // km/h
      const calories = this.calculateCalories(distance, avgSpeed);

      this.activityResults = {
        distance: distance,
        duration: duration,
        avgSpeed: avgSpeed,
        calories: calories
      };

      console.log('Actividad completada:', this.activityResults);

      this.caloriesService.saveDailyCalories(calories);

      // Limpiar datos
      this.positions = [];
      this.startTime = 0;

    } catch (error) {
      console.error('Error deteniendo actividad:', error);
    }
  }

  // ============ CÁLCULOS ============

  private updateStatus() {
    const distance = this.calculateTotalDistance();
    const duration = (Date.now() - this.startTime) / 1000 / 60; // minutos

    this.currentDistance = distance;
    this.currentDuration = duration;
    this.currentSpeed = duration > 0 ? (distance / duration) * 60 : 0;
    this.estimatedCalories = this.calculateCalories(distance, this.currentSpeed);
  }

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

      // Filtrar saltos improbables (más de 100m entre lecturas)
      if (distance < 0.1) {
        totalDistance += distance;
      }
    }

    return totalDistance;
  }

  private haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Radio de la Tierra en km
    const dLat = this.toRad(lat2 - lat1);
    const dLon = this.toRad(lon2 - lon1);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRad(lat1)) * Math.cos(this.toRad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;

    return distance;
  }

  private toRad(degrees: number): number {
    return degrees * (Math.PI / 180);
  }

  private calculateCalories(distance: number, speed: number): number {
    let factor = 50; // walking por defecto

    if (speed < 5) factor = this.CALORIE_FACTORS.walking;
    else if (speed < 8) factor = this.CALORIE_FACTORS.jogging;
    else if (speed < 20) factor = this.CALORIE_FACTORS.running;
    else factor = this.CALORIE_FACTORS.cycling;

    const weightFactor = this.userWeight / 70;
    const calories = distance * factor * weightFactor;

    return Math.round(calories);
  }


  // ============ UTILIDADES ============

  formatTime(minutes: number): string {
    const mins = Math.floor(minutes);
    const secs = Math.floor((minutes - mins) * 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }

  formatDistance(km: number): string {
    if (km < 1) {
      return `${Math.round(km * 1000)} m`;
    }
    return `${km.toFixed(2)} km`;
  }

  getActivityType(speed: number): string {
    if (speed < 5) return 'Caminata';
    if (speed < 8) return 'Trote';
    if (speed < 20) return 'Carrera';
    return 'Ciclismo';
  }

  newActivity() {
    this.activityResults = null;
  }

  async getCurrentPosition(): Promise<Position | null> {
    try {
      const coordinates = await Geolocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 10000
      });
      console.log('Current position:', coordinates);
      return coordinates;
    } catch (e) {
      console.error('Error getting location', e);
      return null;
    }
  }
}
