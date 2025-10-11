import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage implements AfterViewInit {
 @ViewChild('caloriesCanvas') private caloriesCanvas!: ElementRef;

  chart: any;

  constructor() {}

  ngAfterViewInit() {
    setTimeout(() => {
      this.createChart();
    }, 150);
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