import { Component, ElementRef, ViewChild, AfterViewInit, OnInit } from '@angular/core';
import { Auth, onAuthStateChanged } from '@angular/fire/auth';
import type { User } from 'firebase/auth';
import { inject } from '@angular/core';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

// IMPORTAR el servicio (descomentar cuando se una con el código del Home)
/** import { ExercisesService } from 'src/app/services/exercises.service'; */

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

    // Este código permite que los ejercicios seleccionados en la tab de Rutinas
  // se reflejen automáticamente en el Home cuando hagamos el merge.
  // Descomentar e integrar cuando estemos trabajando sobre el .ts correspondiente.

  // Acá se van a guardar los ejercicios seleccionados por rutina
  /** selectedExercises: any = {}; */

  // Inyectar el servicio (ajustar según el constructor existente)
  /** constructor(private exercisesService: ExercisesService) {} */

  private auth: Auth;

  constructor() {
    this.auth = inject(Auth); // inyección modular
  }

  ngOnInit() {
    // Escucha los cambios desde la tab de rutinas
    /** 
     * this.exercisesService.selectedExercises$.subscribe(data => {
     *   this.selectedExercises = data;
     *   console.log('Ejercicios actualizados desde Rutinas:', data);
     * });
     */
    
    onAuthStateChanged(this.auth, (user) => {
      this.user = user;
    });

    this.setGreeting();
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.createChart();
    }, 150);
  }

  getTodayDate(): string {
    const options: Intl.DateTimeFormatOptions = { weekday: 'long',  month: 'long', day: 'numeric' };
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
    const labels = ['Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab', 'Dom'];
    const dataValues = [80, 150, 200, 236, 180, 120, 95];

    // Lógica para que solo 'Jue' sea verde
    const backgroundColors = labels.map(label => label === 'Jue' ? '#82D68E' : '#EAEAEA');
    const textColors = labels.map(label => label === 'Jue' ? '#82D68E' : '#9e9e9e');


    this.chart = new Chart(this.caloriesCanvas.nativeElement, {
      type: 'bar', // Tipo de gráfico
      data: {
        labels: labels,
        datasets: [{
          data: dataValues,
          backgroundColor: backgroundColors,
          borderRadius: 8, // ¡Para redondear las barras!
          borderSkipped: false, // Necesario para que redondee todas las esquinas
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          // Oculta la leyenda superior
          legend: {
            display: false
          },
          // Personaliza el tooltip que aparece al hacer clic
          tooltip: {
            enabled: true,
            callbacks: {
              label: function(context) {
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
              display: false, 
            },
            ticks: {
              color: (context) => textColors[context.index], // Aplica colores dinámicos a las etiquetas
              font: {
                weight: (context) => (labels[context.index] === 'Jue' ? 'bold' : 'normal'),
              }
            }
          }
        }
      }
    });
  }
}
