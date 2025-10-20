import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'card-rutin',
  templateUrl: './card-rutin.component.html',
  styleUrls: ['./card-rutin.component.scss'],
  standalone: false,
})
export class CardRutinComponent {
  @Input() categories: any[] = [];
  @Input() maxSelectedReached: boolean = false;

  @Output() cardSelected = new EventEmitter<string>();
  @Output() exerciseSelected = new EventEmitter<{ cardTitle: string; exercises: any[] }>();

  selectedExercises: Record<string, any[]> = {};
  selectedCard: string | null = null;

  cards = [
    { title: 'Cardio', description: '10 Ejercicios programados', type: 'cardio', color: 'rgb(67, 97, 238, 40%)' },
    { title: 'Musculación', description: '10 Ejercicios programados', type: 'superior', color: 'rgb(255, 146, 43, 40%)' },
    { title: 'Piernas y Glúteos', description: '10 Ejercicios programados', type: 'inferior', color: 'rgb(56, 176, 0, 40%)' },
    { title: 'Entrenamiento de Fuerza', description: '10 Ejercicios programados', type: 'fuerza', color: 'rgb(255, 107, 107, 40%)' },
  ];

  onSelect(card: any) {
    this.cardSelected.emit(card.title);
    this.selectedCard = this.selectedCard === card.title ? null : card.title;
  }

  isCardSelected(cardTitle: string): boolean {
    return this.selectedCard === cardTitle;
  }

  getExercisesForCard(cardTitle: string) {
    const normalize = (t: string) =>
      t.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

    const category = this.categories.find(
      (c) => normalize(c.name) === normalize(cardTitle)
    );

    return category ? category.exercises.slice(0, 10) : [];
  }

  toggleExerciseSelection(cardTitle: string, exercise: any) {
    if (!this.selectedExercises[cardTitle]) this.selectedExercises[cardTitle] = [];

    const current = this.selectedExercises[cardTitle];
    const index = current.findIndex((e) => e.name === exercise.name);

    if (index >= 0) {
      current.splice(index, 1);
    } else {
      if (current.length >= 5) {
        alert('Solo podés elegir hasta 5 ejercicios por rutina.');
        return;
      }
      current.push(exercise);
    }

    this.exerciseSelected.emit({ cardTitle, exercises: current });
  }

  isExerciseSelected(cardTitle: string, exercise: any): boolean {
    return this.selectedExercises[cardTitle]?.some((e) => e.name === exercise.name) || false;
  }

  getExerciseCount(cardTitle: string): number {
    return this.selectedExercises[cardTitle]?.length || 0;
  }
}
