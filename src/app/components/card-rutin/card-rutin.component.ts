import { Component, OnInit, OnChanges, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';

@Component({
  selector: 'card-rutin',
  templateUrl: './card-rutin.component.html',
  styleUrls: ['./card-rutin.component.scss'],
  standalone: false
})
export class CardRutinComponent implements OnInit, OnChanges {
  constructor() {}

  /** Lista de categorías recibidas desde el padre. */
  @Input() categories: any[] = [];

  /** Indica si se alcanzó el límite máximo de rutinas seleccionadas (3). */
  @Input() maxSelectedReached: boolean = false;

  /**
   * Controla si las cards pueden alternarse (modo "toggle").
   * - `true` → permite seleccionar/deseleccionar una card (usado en "Sobre Vos")
   * - `false` → permite abrir solo una card a la vez, sin deseleccionarla (usado en "Routines")
   */
  @Input() allowCardToggle: boolean = false;

  /** Evento que se emite al seleccionar una card. */
  @Output() cardSelected = new EventEmitter<string>();

  /** Cards disponibles con su descripción y color correspondiente. */
  cards = [
    { title: 'Cardio', description: '10 Ejercicios programados', type: 'cardio', color: 'rgb(67, 97, 238, 40%)' },
    { title: 'Musculación', description: '10 Ejercicios programados', type: 'superior', color: 'rgb(255, 146, 43, 40%)' },
    { title: 'Piernas y Glúteos', description: '10 Ejercicios programados', type: 'inferior', color: 'rgb(56, 176, 0, 40%)' },
    { title: 'Entrenamiento de Fuerza', description: '10 Ejercicios programados', type: 'fuerza', color: 'rgb(255, 107, 107, 40%)' }
  ];

  displayCards = [...this.cards];
  selectedCard: string | null = null;
  selectedExercises: Record<string, any[]> = {};

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['categories']) {
      this.displayCards = [...this.cards];
    }
  }

  /**
   * Maneja la selección de una card al hacer clic.
   * Su comportamiento depende del valor de `allowCardToggle`.
   * 
   * - En modo toggle (Onboarding - know-you/rutins): permite abrir o cerrar libremente.
   * - En modo visual (Main - Routines): solo abre una card a la vez y no se deselecciona.
   * 
   * Además, controla el límite máximo de 3 rutinas seleccionadas.
   * 
   * @param card - Card que fue clickeada por el usuario.
   */
  onSelect(card: any) {
    // Si ya se alcanzó el límite y la card actual NO está abierta, bloquear
    if (this.maxSelectedReached && this.selectedCard !== card.title) {
      alert('Alcanzaste el máximo de 3 rutinas.');
      return; // Evita que se abra visualmente
    }

    // Modo toggle → abrir/cerrar libremente (para "know-you/rutins")
    if (this.allowCardToggle) {
      this.selectedCard = this.selectedCard === card.title ? null : card.title;
    } 
    // Modo visual → abrir solo una card a la vez (para "Routines")
    else {
      if (this.selectedCard === card.title) return;
      this.selectedCard = card.title;
    }

    // Solo si pasa las validaciones, emitimos el evento al padre
    this.cardSelected.emit(card.title);
  }


  /** Devuelve los ejercicios asociados a una card específica. */
  getExercisesForCard(cardTitle: string) {
    const normalize = (text: string) =>
      text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

    const category = this.categories.find(
      c => normalize(c.name) === normalize(cardTitle)
    );

    return category ? category.exercises.slice(0, 10) : [];
  }

  /** Alterna la selección de un ejercicio dentro de una rutina. */
  toggleExerciseSelection(cardTitle: string, exercise: any) {
    if (!this.selectedExercises[cardTitle]) {
      this.selectedExercises[cardTitle] = [];
    }

    const current = this.selectedExercises[cardTitle];
    const index = current.findIndex(e => e.name === exercise.name);

    if (index >= 0) {
      // Deselecciona el ejercicio
      current.splice(index, 1);
    } else {
      // Si intenta seleccionar más de 5, muestra alerta
      if (current.length >= 5) {
        alert('Solo podés elegir hasta 5 ejercicios por rutina.');
        return;
      }
      current.push(exercise);
    }
  }

  /** Verifica si un ejercicio ya está seleccionado dentro de una rutina. */
  isExerciseSelected(cardTitle: string, exercise: any): boolean {
    return this.selectedExercises[cardTitle]?.some(e => e.name === exercise.name) || false;
  }

  /** Devuelve la cantidad de ejercicios seleccionados por rutina. */
  getExerciseCount(cardTitle: string): number {
    return this.selectedExercises[cardTitle]?.length || 0;
  }
}

