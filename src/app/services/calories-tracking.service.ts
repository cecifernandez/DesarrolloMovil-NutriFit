import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CaloriesTrackingService {

  private STORAGE_KEY = 'dailyCalories';

  constructor() { 
    // ==========================================
    // LLAMADA A LA FUNCIÓN MOCK (SOLO PARA PRUEBAS)
    // ==========================================
    // Comprueba si ya hay datos para no sobreescribirlos
    if (!localStorage.getItem(this.STORAGE_KEY)) {
      console.log('No hay datos. Generando datos mock...');
      this._generateMockData();
    }
  }

  /**
   * Genera datos falsos de calorías para los últimos 30 días.
   * @private
   */
  private _generateMockData() {
    const mockData: { [key: string]: number } = {};
    const today = new Date();
    const daysToMock = 30; // Genera datos para los últimos 30 días

    for (let i = 0; i < daysToMock; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const dateKey = date.toISOString().split('T')[0]; // YYYY-MM-DD

      // Genera un número aleatorio de calorías (entre 200 y 850)
      const randomCalories = Math.floor(Math.random() * 651) + 200;
      
      mockData[dateKey] = randomCalories;
    }
    
    // Guarda los datos mock en localStorage
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(mockData));
    console.log('Datos mock generados:', mockData);
  }

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

  /**
   * Suma todas las calorías quemadas en los últimos 7 días.
   * @returns {number} El total de calorías de la semana.
   */
  getTotalWeeklyCalories(): number {
    // 1. Obtenemos el array de los últimos 7 días
    const weeklyData = this.getWeeklyCalories();

    // 2. Sumamos todos los valores del array
    // .reduce() toma un 'acumulador' (sum) y el 'valor actual' (dailyCalories)
    // y los suma, empezando desde 0.
    const total = weeklyData.reduce(
      (sum, dailyCalories) => sum + dailyCalories,
      0 // El valor inicial de la suma
    );

    return total;
  }

  /**
   * Helper: Devuelve el Lunes de una semana dada en formato YYYY-MM-DD
   */
  private getStartOfWeek(date: Date): string {
    const d = new Date(date);
    // 0=Dom, 1=Lun, 2=Mar...
    const day = d.getDay();
    // Ajusta la fecha para que sea Lunes.
    // Si es Domingo (0), resta 6 días. Si es Lunes (1), resta 0. Si es Martes (2), resta 1.
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    d.setDate(diff);
    return d.toISOString().split('T')[0];
  }

  /**
   * Agrupa todas las calorías por semana.
   * @param weekCount El número de semanas pasadas que queremos mostrar (ej. 4)
   * @returns Un objeto con 'labels' para el gráfico y 'data' con los totales.
   */
  getCaloriesForPastWeeks(weekCount: number = 4): { labels: string[], data: number[] } {
    const storedData = JSON.parse(localStorage.getItem(this.STORAGE_KEY) || '{}');
    const weeklyTotals: { [weekStart: string]: number } = {};

    // 1. Agrupar TODOS los datos guardados en sus semanas correspondientes
    for (const dateKey in storedData) {
      // Aseguramos que la fecha se parsea como local
      const date = new Date(dateKey + 'T00:00:00');
      const weekStartKey = this.getStartOfWeek(date); // 'YYYY-MM-DD' del lunes

      if (!weeklyTotals[weekStartKey]) {
        weeklyTotals[weekStartKey] = 0;
      }
      weeklyTotals[weekStartKey] += storedData[dateKey];
    }

    // 2. Ordenar las semanas por fecha (más antigua a más nueva)
    const sortedWeekKeys = Object.keys(weeklyTotals).sort();

    // 3. Quedarnos solo con las últimas 'weekCount' semanas
    const recentWeekKeys = sortedWeekKeys.slice(-weekCount);

    const labels: string[] = [];
    const data: number[] = [];

    // 4. Formatear los datos y etiquetas para el gráfico
    for (const weekStartKey of recentWeekKeys) {
      const startDate = new Date(weekStartKey + 'T00:00:00');
      
      // Crear etiqueta "Oct 20-26"
      const endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + 6);
      
      // Formato 'es-ES' para "Oct 20"
      const startStr = startDate.toLocaleDateString('es-ES', { month: 'short', day: 'numeric' });
      const endStr = endDate.toLocaleDateString('es-ES', { day: 'numeric' });
      
      labels.push(`${startStr} - ${endStr}`);
      data.push(weeklyTotals[weekStartKey]);
    }

    return { labels, data };
  }

  // Limpia todos los datos
  resetCalories() {
    localStorage.removeItem(this.STORAGE_KEY);
    console.log('Datos de calorías reiniciados');
  }
}
