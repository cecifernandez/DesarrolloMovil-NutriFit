import {
  Component,
  forwardRef,
  ViewChild
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { IonModal } from '@ionic/angular';
import { MONTHS } from '@/app/constants/months.constants';

@Component({
  standalone: false,
  selector: 'picker-date',
  templateUrl: './picker-date.component.html',
  styleUrls: ['./picker-date.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PickerDateComponent),
      multi: true
    }
  ],
})
export class PickerDateComponent implements ControlValueAccessor {
  @ViewChild(IonModal) modal!: IonModal;
  days: number[] = [];
  months = MONTHS;
  years: number[] = [];

  selectedDay: number = 1;
  selectedMonth: number = 1;
  selectedYear: number = 2000;
  value: string = '';

  private onChange: (value: string) => void = () => { };
  private onTouched: () => void = () => { };

  ngOnInit() {
    const currentYear = new Date().getFullYear();
    this.years = Array.from({ length: 100 }, (_, i) => currentYear - i);

    this.updateDay();
  }

  /**
 * Abre el modal de selección de fecha.
 *
 * Llama al método `present()` del modal (Ionic) para mostrarlo en pantalla.
 * Generalmente se usa cuando el usuario toca el input o un botón de "seleccionar fecha".
 *
 * @returns {void}
 */
  openModal(): void {
    this.modal.present();
  }

  /**
   * Cierra el modal y, si el cierre fue con confirmación, actualiza el valor del control.
   *
   * Si el `role` es `'confirm'`, construye la fecha con el formato `dd/MM/yyyy`
   * usando los valores seleccionados (`selectedDay`, `selectedMonth`, `selectedYear`),
   * la asigna al valor interno, notifica el cambio al formulario con `onChange(...)`
   * y marca el control como "tocado" con `onTouched()`. Luego cierra el modal.
   *
   * @param {string} role - Motivo o rol con el que se cierra el modal (`'confirm'`, `'cancel'`, etc.).
   * @returns {void}
   */
  closeModal(role: string): void {
    if (role === 'confirm') {
      this.value = this.formatDate(this.selectedDay, this.selectedMonth, this.selectedYear);
      this.onChange(this.value);
      this.onTouched();
    }
    this.modal.dismiss();
  }

  /**
   * Escribe un valor en el control desde el formulario padre.
   *
   * Parte de la interfaz `ControlValueAccessor`. Angular llama a este método cuando
   * quiere establecer el valor inicial o cuando hace un reset del formulario.
   *
   * @param {any} value - Valor de fecha en formato de cadena (por ejemplo, "05/10/2025").
   * @returns {void}
   */
  writeValue(value: any): void {
    this.value = value;
  }

  /**
   * Registra la función que Angular debe llamar cuando cambie el valor del control.
   *
   * El formulario reactivo pasa esta función (`fn`) y el componente la guarda para
   * llamarla en el momento en que el usuario confirma la fecha en el modal.
   *
   * @param {(value: any) => void} fn - Función de callback para propagar cambios al formulario.
   * @returns {void}
   */
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  /**
   * Registra la función que Angular debe llamar cuando el control sea marcado como tocado.
   *
   * El formulario reactivo pasa esta función (`fn`) y el componente la invoca cuando
   * el usuario termina de interactuar (por ejemplo, al cerrar el modal).
   *
   * @param {() => void} fn - Función de callback para notificar el estado de "tocado".
   * @returns {void}
   */
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  /**
   * Se ejecuta cuando el modal terminó de cerrarse.
   *
   * Marca el control como "tocado" para que el formulario pueda disparar
   * validaciones o actualizar el estado visual.
   *
   * @returns {void}
   */
  onDidDismiss(): void {
    this.onTouched();
  }

  /**
   * Maneja el cambio del día seleccionado dentro del modal.
   *
   * Actualiza `selectedDay` con el valor que viene del componente Ionic
   * (generalmente un `ion-select` o `ion-datetime` simplificado).
   *
   * @param {any} e - Evento emitido por el componente de selección de día.
   * @returns {void}
   */
  onDayChange(e: any): void {
    this.selectedDay = e.detail.value;
  }

  /**
   * Maneja el cambio del mes seleccionado y recalcula los días válidos.
   *
   * Actualiza `selectedMonth` y luego llama a `updateDay()` para regenerar
   * el arreglo de días según el mes y año seleccionados (por ejemplo, febrero).
   *
   * @param {any} e - Evento emitido por el componente de selección de mes.
   * @returns {void}
   */
  onMonthChange(e: any): void {
    this.selectedMonth = e.detail.value;
    this.updateDay();
  }

  /**
   * Maneja el cambio del año seleccionado y recalcula los días válidos.
   *
   * Actualiza `selectedYear` y luego llama a `updateDay()` para contemplar
   * años bisiestos o cambios de febrero.
   *
   * @param {any} e - Evento emitido por el componente de selección de año.
   * @returns {void}
   */
  onYearChange(e: any): void {
    this.selectedYear = e.detail.value;
    this.updateDay();
  }

  /**
   * Recalcula la cantidad de días válidos para el mes/año seleccionados.
   *
   * Calcula el número máximo de días para el mes actual usando `new Date(año, mes, 0)`
   * (truco de JS para obtener el último día del mes). Luego genera el arreglo de días
   * y, si el día seleccionado quedó fuera de rango (por ejemplo, 31 en un mes de 30),
   * lo corrige.
   *
   * @private
   * @returns {void}
   */
  private updateDay(): void {
    const maxDays = new Date(this.selectedYear, this.selectedMonth, 0).getDate();
    this.days = Array.from({ length: maxDays }, (_, i) => i + 1);

    if (this.selectedDay > maxDays) this.selectedDay = maxDays;
  }

  /**
   * Formatea una fecha en el formato `dd/MM/yyyy`.
   *
   * Asegura que el día y el mes tengan siempre 2 dígitos (01, 02, ..., 12) usando
   * `padStart(2, '0')`. Devuelve la cadena final con el año al final.
   *
   * @private
   * @param {number} day - Día seleccionado.
   * @param {number} month - Mes seleccionado (1-12).
   * @param {number} year - Año seleccionado (por ejemplo, 2025).
   * @returns {string} Fecha formateada en formato `dd/MM/yyyy`.
   */
  private formatDate(day: number, month: number, year: number): string {
    const d = day.toString().padStart(2, '0');
    const m = month.toString().padStart(2, '0');
    return `${d}/${m}/${year}`;
  }

}
