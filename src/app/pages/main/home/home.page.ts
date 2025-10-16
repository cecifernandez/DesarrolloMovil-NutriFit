import { Component, OnInit } from '@angular/core';

// IMPORTAR el servicio (descomentar cuando se una con el código del Home)
/** import { ExercisesService } from 'src/app/services/exercises.service'; */

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: false
})
export class HomePage implements OnInit {
  // Este código permite que los ejercicios seleccionados en la tab de Rutinas
  // se reflejen automáticamente en el Home cuando hagamos el merge.
  // Descomentar e integrar cuando estemos trabajando sobre el .ts correspondiente.

  // Acá se van a guardar los ejercicios seleccionados por rutina
  /** selectedExercises: any = {}; */

  // Inyectar el servicio (ajustar según el constructor existente)
  /** constructor(private exercisesService: ExercisesService) {} */

  ngOnInit() {
    // Escucha los cambios desde la tab de rutinas
    /** 
     * this.exercisesService.selectedExercises$.subscribe(data => {
     *   this.selectedExercises = data;
     *   console.log('Ejercicios actualizados desde Rutinas:', data);
     * });
     */
  }
}
