import { Component, OnInit, OnChanges, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';

@Component({
  selector: 'card-rutin',
  templateUrl: './card-rutin.component.html',
  styleUrls: ['./card-rutin.component.scss'],
  standalone: false
})
export class CardRutinComponent implements OnInit, OnChanges {
  constructor() { }

  //permitir sobreescribir las cards desde afuera
  @Input() categories: any[] = [];

  //emitir evento cuando se selecciona una card
  @Output() cardSelected = new EventEmitter<string>();

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

  //Getter que usa las externas si existen
  onSelect(card: any) {
    this.selectedCard = this.selectedCard === card.title ? null : card.title;
    this.cardSelected.emit(card.title);
  }

  getExercisesForCard(cardTitle: string) {
    const normalize = (text: string) =>
      text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

    const category = this.categories.find(
      c => normalize(c.name) === normalize(cardTitle)
    );

    return category ? category.exercises.slice(0, 10) : [];
  }

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

  isExerciseSelected(cardTitle: string, exercise: any): boolean {
    return this.selectedExercises[cardTitle]?.some(e => e.name === exercise.name) || false;
  }

  getExerciseCount(cardTitle: string): number {
    return this.selectedExercises[cardTitle]?.length || 0;
  }
}
