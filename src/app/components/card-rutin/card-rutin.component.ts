import { Component, Input, Output, EventEmitter } from '@angular/core';
// 1. Importa la API modular (nueva) para Firestore
import { Firestore, collection, addDoc } from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';

@Component({
  selector: 'card-rutin',
  templateUrl: './card-rutin.component.html',
  styleUrls: ['./card-rutin.component.scss'],
  standalone: false, // Asegúrate que este componente esté declarado en un NgModule
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

  constructor(
    // 2. Inyecta 'Firestore' (nuevo) en lugar de 'AngularFirestore' (antiguo)
    private firestore: Firestore,
    private auth: Auth
  ) {}

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

  // 3. guardar rutina en Firebase (con sintaxis modular)
  async saveRoutine(cardTitle: string) {
    const user = this.auth.currentUser;
    if (!user) {
      alert('Debes iniciar sesión para guardar la rutina.');
      return;
    }

    const selected = this.selectedExercises[cardTitle];
    if (!selected || selected.length === 0) {
      alert('Seleccioná al menos un ejercicio antes de guardar.');
      return;
    }

    const card = this.cards.find(c => c.title === cardTitle);
    const routineData = {
      title: card?.title,
      description: card?.description,
      exercises: selected,
      createdAt: new Date(),
    };

    try {
      // 4. Esta es la nueva sintaxis para guardar datos
      // Crea la referencia a la subcolección: 'userRoutines/{userId}/routines'
      const routinesCollectionRef = collection(this.firestore, `userRoutines/${user.uid}/routines`);
      
      // Añade el nuevo documento a esa subcolección
      await addDoc(routinesCollectionRef, routineData);

      alert(`Rutina "${cardTitle}" guardada con éxito ✅`);
    } catch (error) {
      console.error('Error guardando rutina:', error);
      alert('Ocurrió un error al guardar la rutina.');
    }
  }
}