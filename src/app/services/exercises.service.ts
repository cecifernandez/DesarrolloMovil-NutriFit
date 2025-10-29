import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { BehaviorSubject } from 'rxjs';
import { Firestore, doc, getDoc } from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class ExercisesService {
  private apiUrl = 'https://exercises-by-api-ninjas.p.rapidapi.com/v1/exercises';

  // Guarda los ejercicios seleccionados por rutina
  private selectedExercisesSubject = new BehaviorSubject<{ [key: string]: any[] }>({});
  selectedExercises$ = this.selectedExercisesSubject.asObservable();

  constructor(private http: HttpClient, private firestore: Firestore, private auth: Auth) {}

  /**
   * Actualiza los ejercicios seleccionados para una rutina específica
   */
  setSelectedExercises(routine: string, exercises: any[]) {
    const current = this.selectedExercisesSubject.value;
    this.selectedExercisesSubject.next({
      ...current,
      [routine]: exercises
    });
  }

  /**
   * Devuelve todos los ejercicios seleccionados actuales
   */
  getSelectedExercises() {
    return this.selectedExercisesSubject.value;
  }

  /**
   * Obtiene ejercicios filtrados por tipo o músculo.
   * Si la API falla (por límite o error), usa el mock local de /assets/mocks/
   * @param paramName - "type" o "muscle"
   * @param paramValue - valor de ese parámetro (por ej. "cardio" o "biceps")
   * @param limit - cantidad máxima de ejercicios a traer
   */
  getExercises(paramName: 'type' | 'muscle', paramValue: string, limit = 10): Observable<any[]> {
    const headers = new HttpHeaders({
      'X-RapidAPI-Key': environment.rapidApiKey,
      'X-RapidAPI-Host': 'exercises-by-api-ninjas.p.rapidapi.com',
    });

    const url = `${this.apiUrl}?${paramName}=${paramValue}`;

    return new Observable<any[]>((observer) => {
      /**
       * MODO DESARROLLO:
       * Forzamos el uso de los mocks locales en lugar de la API real.
       * Esto evita gastar las llamadas del plan gratuito de RapidAPI
       * cada vez que se recarga la aplicación.
       * 
       * Dejar este bloque DESCOMENTADO mientras se trabaja en diseño o pruebas.
       * COMENTAR este bloque y reactivar la API real (abajo) para la presentación.
       */
      // this.http.get<any[]>(`/assets/mocks/${paramValue}.json`).subscribe({
      //   next: (mockData) => {
      //     observer.next(mockData.slice(0, limit));
      //     observer.complete();
      //   },
      //   error: (mockErr) => {
      //     console.error(`Error al cargar el mock de ${paramValue}`, mockErr);
      //     observer.error(mockErr);
      //   }
      // });

      // BLOQUE ORIGINAL DE LA API (DESACTIVADO EN MODO DESARROLLO)
      this.http.get<any[]>(url, { headers }).subscribe({
        next: (data) => {
          observer.next(data.slice(0, limit));
          observer.complete();
        },
        error: (err) => {
          console.warn(`⚠️ Error con API (${paramValue}), usando mock local...`, err);
          //Fallback: carga el JSON local
          this.http.get<any[]>(`/assets/mocks/${paramValue}.json`).subscribe({
            next: (mockData) => {
              observer.next(mockData.slice(0, limit));
              observer.complete();
            },
            error: (mockErr) => {
              console.error(`Error al cargar el mock de ${paramValue}`, mockErr);
              observer.error(mockErr);
            }
          });
        }
      });
    });
  }

  async getUserRoutines(): Promise<any[]> {
    const user = await this.auth.currentUser;
    if (!user) return [];

    const ref = doc(this.firestore, `users/${user.uid}`);
    const snap = await getDoc(ref);

    if (!snap.exists()) return [];
    const data = snap.data();

    console.log("secle",data['selectedRoutines'] )
    return data['selectedRoutines'] || [];
  }
}
