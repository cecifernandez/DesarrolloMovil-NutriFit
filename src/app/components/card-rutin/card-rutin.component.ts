import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Firestore, collection, addDoc } from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';

@Component({
  selector: 'card-rutin',
  templateUrl: './card-rutin.component.html',
  styleUrls: ['./card-rutin.component.scss'],
  standalone: false, 
})
export class CardRutinComponent {
  @Input() categories: Array<{
    name?: string;
    exercises?: any[];
    selectedExercises?: any[];
  }> = [];
  @Input() maxSelectedReached: boolean = false;
  @Input() viewExcercises: boolean = false;

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
    private firestore: Firestore,
    private auth: Auth
  ) { }

  /**
 * Gestiona la selección de una tarjeta y emite el título seleccionado.
 *
 * Esta función se ejecuta cuando el usuario selecciona una tarjeta. Primero emite
 * el título de la tarjeta seleccionada mediante el `EventEmitter` `cardSelected`,
 * para que el componente padre pueda reaccionar. Luego, aplica la lógica de
 * "toggle": si la tarjeta ya estaba seleccionada, la desmarca (pone `null`);
 * si no lo estaba, guarda el título como tarjeta seleccionada.
 *
 * @param {any} card - Objeto de la tarjeta seleccionada, debe contener la propiedad `title`.
 * @returns {void}
 */
  onSelect(card: any) {
    this.cardSelected.emit(card.title);
    this.selectedCard = this.selectedCard === card.title ? null : card.title;
  }

  /**
 * Verifica si una tarjeta está actualmente seleccionada.
 *
 * Compara el título recibido con el título almacenado en `selectedCard` para
 * determinar si es la tarjeta activa en el momento. Esto se usa normalmente
 * en la plantilla para aplicar estilos condicionales o mostrar/ocultar contenido.
 *
 * @param {string} cardTitle - Título de la tarjeta a validar.
 * @returns {boolean} `true` si la tarjeta está seleccionada, `false` en caso contrario.
 */
  isCardSelected(cardTitle: string): boolean {

    return this.selectedCard === cardTitle;
  }

  /**
 * Obtiene la lista de ejercicios asociada a una tarjeta (categoría).
 *
 * Esta función busca dentro de `this.categories` la categoría cuyo nombre coincide
 * con el título de la tarjeta. Para hacer la comparación más robusta, normaliza
 * los textos (quita acentos y pasa a minúsculas). Si encuentra la categoría:
 *
 * - Si la categoría tiene ejercicios seleccionados (`selectedExercises`) **y**
 *   la vista actual permite verlos (`this.viewExcercises === true`), devuelve esos.
 * - De lo contrario, devuelve los ejercicios base de la categoría limitados a 10.
 *
 * Si no encuentra la categoría, devuelve un array vacío.
 *
 * @param {string} cardTitle - Título de la tarjeta/categoría cuyos ejercicios se desean obtener.
 * @returns {any[]} Arreglo de ejercicios asociados a la tarjeta. Si no hay coincidencia, devuelve `[]`.
 */
  getExercisesForCard(cardTitle: string) {
    const norm = (t?: string) =>
      (t ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

    const category = this.categories?.find(c => norm(c.name) === norm(cardTitle));

    if (!category) return [];

    const selected = category.selectedExercises ?? [];
    const base = category.exercises ?? [];

    return selected.length > 0 && this.viewExcercises ? category.selectedExercises : category.exercises?.slice(0, 10) ;
  }

  /*
  getExercisesForCard(cardTitle: string) {
    const category = this.categories.find(c => c.name === cardTitle);
    return category ? category.selectedExercises || [] : [];
  }*/
  /**
 * Alterna (agrega o quita) un ejercicio dentro de la selección de una tarjeta/rutina.
 *
 * Si la tarjeta aún no tiene ejercicios seleccionados, inicializa el arreglo.
 * Luego busca si el ejercicio ya está seleccionado:
 * - Si está, lo quita.
 * - Si no está, lo agrega, pero validando que no se superen los 5 ejercicios por tarjeta.
 *
 * Al final, emite el evento `exerciseSelected` con el título de la tarjeta y
 * el arreglo actualizado, para que el componente padre pueda persistir o reaccionar.
 *
 * @param {string} cardTitle - Título de la tarjeta/rutina a la que pertenece el ejercicio.
 * @param {any} exercise - Objeto del ejercicio seleccionado o deseleccionado.
 * @returns {void}
 */
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

  /**
 * Verifica si un ejercicio está seleccionado para una tarjeta/rutina dada.
 *
 * Revisa dentro de `this.selectedExercises[cardTitle]` si existe un ejercicio con el
 * mismo nombre. Esto se usa típicamente en la vista para marcar checkboxes, aplicar
 * estilos activos o mostrar un contador visual.
 *
 * @param {string} cardTitle - Título de la tarjeta/rutina donde se está buscando.
 * @param {any} exercise - Ejercicio a validar dentro de la selección.
 * @returns {boolean} `true` si el ejercicio está seleccionado, `false` en caso contrario.
 */
  isExerciseSelected(cardTitle: string, exercise: any): boolean {
    return this.selectedExercises[cardTitle]?.some((e) => e.name === exercise.name) || false;
  }

  /**
 * Obtiene la cantidad de ejercicios seleccionados para una tarjeta/rutina.
 *
 * Es útil para mostrar un contador al usuario (por ejemplo "3/5") y para validar
 * límites máximos en el UI. Si la tarjeta no tiene selección previa, devuelve 0.
 *
 * @param {string} cardTitle - Título de la tarjeta/rutina a consultar.
 * @returns {number} Número de ejercicios actualmente seleccionados para esa tarjeta.
 */
  getExerciseCount(cardTitle: string): number {
    return this.selectedExercises[cardTitle]?.length || 0;
  }

  /**
 * Guarda en Firestore la rutina seleccionada para una tarjeta/rutina específica.
 *
 * El flujo es:
 * 1. Verifica que el usuario esté autenticado; si no, muestra un mensaje.
 * 2. Verifica que haya al menos un ejercicio seleccionado para esa tarjeta.
 * 3. Busca la tarjeta original (para traer título y descripción).
 * 4. Arma el objeto de rutina con metadata básica.
 * 5. Inserta el documento en la colección `userRoutines/{uid}/routines` de Firestore.
 * 6. Si todo sale bien, muestra un mensaje de éxito; si no, informa el error.
 *
 * Esta función depende de:
 * - `this.auth.currentUser` para obtener el usuario logueado.
 * - `this.firestore` para acceder a Firestore.
 * - `collection` y `addDoc` de Firebase modular.
 *
 * @async
 * @param {string} cardTitle - Título de la tarjeta/rutina que se desea guardar.
 * @returns {Promise<void>} Promesa que se resuelve cuando la rutina fue guardada o se produjo un error.
 */
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

      const routinesCollectionRef = collection(this.firestore, `userRoutines/${user.uid}/routines`);

      await addDoc(routinesCollectionRef, routineData);

      alert(`Rutina "${cardTitle}" guardada con éxito ✅`);
    } catch (error) {
      console.error('Error guardando rutina:', error);
      alert('Ocurrió un error al guardar la rutina.');
    }
  }
}