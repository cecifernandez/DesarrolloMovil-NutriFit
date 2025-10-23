import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CaloriesTrackingService {

  private STORAGE_KEY = 'dailyCalories';

  constructor() {}

  // Guarda las kcal del día actual
  saveDailyCalories(calories: number) {
    const today = new Date();
    const dateKey = today.toISOString().split('T')[0]; // YYYY-MM-DD

    const storedData = JSON.parse(localStorage.getItem(this.STORAGE_KEY) || '{}');
    storedData[dateKey] = (storedData[dateKey] || 0) + calories;

    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(storedData));
    console.log('Kcal guardadas:', storedData);
  }

  // Devuelve las kcal de los últimos 7 días (incluyendo hoy)
  getWeeklyCalories(): number[] {
    const storedData = JSON.parse(localStorage.getItem(this.STORAGE_KEY) || '{}');
    const result: number[] = [];
    const today = new Date();

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const key = date.toISOString().split('T')[0];
      result.push(storedData[key] || 0);
    }

    return result;
  }

  // Devuelve etiquetas con los días de la semana de los últimos 7 días
  getLast7DaysLabels(): string[] {
    const labels: string[] = [];
    const days = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

    const today = new Date();

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      labels.push(days[date.getDay()]);
    }

    return labels;
  }

  // Limpia todos los datos
  resetCalories() {
    localStorage.removeItem(this.STORAGE_KEY);
    console.log('Datos de calorías reiniciados');
  }
}
