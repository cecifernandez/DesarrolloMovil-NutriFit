import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CaloriesTrackingService {

  private STORAGE_KEY = 'dailyCalories';

  constructor() {
  }

  /**
   * Genera datos falsos de calorías para los últimos 30 días.
   * @private
   */
  private _generateMockData() {
    const mockData: { [key: string]: number } = {};
    const today = new Date();
    const daysToMock = 30;

    for (let i = 0; i < daysToMock; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const dateKey = date.toISOString().split('T')[0];

      const randomCalories = Math.floor(Math.random() * 651) + 200;

      mockData[dateKey] = randomCalories;
    }

    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(mockData));
    console.log('Datos mock generados:', mockData);
  }

  /**
 * Guarda las calorías quemadas para el día actual en `localStorage`.
 *
 * - Usa la fecha de hoy como key en formato `YYYY-MM-DD`.
 * - Si ya había calorías guardadas para hoy, las suma.
 * - Persiste todo en `this.STORAGE_KEY`.
 *
 * @param {number} calories - Cantidad de calorías a sumar al día de hoy.
 * @returns {void}
 */
  saveDailyCalories(calories: number): void {
    const today = new Date();
    const dateKey = today.toISOString().split('T')[0];

    const storedData = JSON.parse(localStorage.getItem(this.STORAGE_KEY) || '{}');
    storedData[dateKey] = (storedData[dateKey] || 0) + calories;

    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(storedData));
    console.log('Kcal guardadas:', storedData);
  }

  /**
   * Devuelve un arreglo con las calorías de los últimos 7 días (hoy incluido).
   *
   * Si algún día no tiene datos, se completa con 0. Esto permite graficar
   * correctamente en el frontend sin huecos.
   *
   * @returns {number[]} Arreglo de 7 números, de más antiguo a más reciente.
   */
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

  /**
   * Genera las etiquetas (días) para los últimos 7 días.
   *
   * Devuelve abreviaturas en español: `['Dom', 'Lun', ...]` según el día
   * correspondiente a cada una de las últimas 7 fechas.
   *
   * @returns {string[]} Arreglo de 7 etiquetas de día.
   */
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
   *
   * Usa `getWeeklyCalories()` para obtener el arreglo ya normalizado
   * y luego lo reduce a un único número.
   *
   * @returns {number} Total de calorías de la semana.
   */
  getTotalWeeklyCalories(): number {
    const weeklyData = this.getWeeklyCalories();

    const total = weeklyData.reduce(
      (sum, dailyCalories) => sum + dailyCalories,
      0
    );

    return total;
  }

  /**
   * Calcula el lunes (inicio de semana) de la fecha indicada y lo devuelve en formato `YYYY-MM-DD`.
   *
   * Esto se usa para agrupar los registros diarios por semanas.
   *
   * @private
   * @param {Date} date - Fecha de referencia.
   * @returns {string} Fecha del lunes de esa semana.
   */
  private getStartOfWeek(date: Date): string {
    const d = new Date(date);
    const day = d.getDay();

    // Si es domingo (0), restamos 6 para ir al lunes anterior
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    d.setDate(diff);
    return d.toISOString().split('T')[0];
  }

  /**
   * Agrupa todas las calorías almacenadas por semana y devuelve las últimas N.
   *
   * - Recorre todo el historial del `localStorage`.
   * - Agrupa los días por el lunes de su semana.
   * - Ordena las semanas por fecha.
   * - Devuelve las `weekCount` más recientes con su label y total.
   *
   * Esto es ideal para gráficos de barras semanales.
   *
   * @param {number} [weekCount=4] - Número de semanas a devolver (por defecto 4).
   * @returns {{ labels: string[], data: number[] }} Etiquetas (rango de fechas) y totales por semana.
   */
  getCaloriesForPastWeeks(
    weekCount: number = 4
  ): { labels: string[]; data: number[] } {
    const storedData = JSON.parse(localStorage.getItem(this.STORAGE_KEY) || '{}');
    const weeklyTotals: { [weekStart: string]: number } = {};

    for (const dateKey in storedData) {
      const date = new Date(dateKey + 'T00:00:00');
      const weekStartKey = this.getStartOfWeek(date);

      if (!weeklyTotals[weekStartKey]) {
        weeklyTotals[weekStartKey] = 0;
      }
      weeklyTotals[weekStartKey] += storedData[dateKey];
    }

    const sortedWeekKeys = Object.keys(weeklyTotals).sort();

    const recentWeekKeys = sortedWeekKeys.slice(-weekCount);

    const labels: string[] = [];
    const data: number[] = [];

    for (const weekStartKey of recentWeekKeys) {
      const startDate = new Date(weekStartKey + 'T00:00:00');

      const endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + 6);

      const startStr = startDate.toLocaleDateString('es-ES', {
        month: 'short',
        day: 'numeric',
      });
      const endStr = endDate.toLocaleDateString('es-ES', { day: 'numeric' });

      labels.push(`${startStr} - ${endStr}`);
      data.push(weeklyTotals[weekStartKey]);
    }

    return { labels, data };
  }

  /**
   * Elimina todo el historial de calorías almacenado.
   *
   * Útil para debugging o para que el usuario pueda resetear su progreso.
   *
   * @returns {void}
   */
  resetCalories(): void {
    localStorage.removeItem(this.STORAGE_KEY);
    console.log('Datos de calorías reiniciados');
  }

}
