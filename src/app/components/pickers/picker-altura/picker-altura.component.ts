import { Component, EventEmitter, forwardRef, Input, Output, ViewChild } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { IonModal } from '@ionic/angular';

@Component({
  selector: 'picker-altura',
  templateUrl: './picker-altura.component.html',
  styleUrls: ['./picker-altura.component.scss'],
  standalone: false,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PickerAlturaComponent),
      multi: true
    }
  ],
})
export class PickerAlturaComponent implements ControlValueAccessor {
  @ViewChild(IonModal) modal!: IonModal;

  alturaNumeros: number[] = [];
  unidades: string[] = ['cm'];

  selectedAltura: number = 170;
  selectedUnidad: string = 'cm';
  value: string = '';

  /**
 * Callback que Angular usa para notificar cambios de valor al formulario.
 *
 * Se inicializa con una función vacía para evitar errores cuando el control
 * todavía no fue registrado por el `ControlValueAccessor`.
 *
 * @private
 * @type {(value: string) => void}
 */
  private onChange: (value: string) => void = () => { };

  /**
 * Callback que Angular usa para notificar que el control fue tocado.
 *
 * Se inicializa con una función vacía para evitar errores cuando el control
 * todavía no fue registrado por el `ControlValueAccessor`.
 *
 * @private
 * @type {() => void}
 */
  private onTouched: () => void = () => { };

  ngOnInit(): void {
    this.alturaNumeros = Array.from({ length: 200 }, (_, i) => i + 1);
    this.value = `${this.selectedAltura} ${this.selectedUnidad}`;
  }

  /**
 * Abre el modal de selección de altura/unidad.
 *
 * Llama al método `present()` del modal (Ionic) para mostrarlo. Generalmente
 * se enlaza desde un botón o desde un `(click)` en el input.
 *
 * @returns {void}
 */
  openModal() {
    this.modal.present();
  }

  /**
 * Cierra el modal y, si el cierre fue por confirmación, actualiza el valor del control.
 *
 * Si el `role` es `'confirm'`, arma el string de altura (`"170 cm"`, `"5 ft"`, etc.),
 * lo propaga al formulario llamando a `onChange(...)` y marca el control como tocado
 * llamando a `onTouched()`. Luego cierra el modal.
 *
 * @param {string} role - Rol con el que se cierra el modal (`'confirm'`, `'cancel'`, etc.).
 * @returns {void}
 */
  closeModal(role: string) {
    if (role === 'confirm') {
      this.value = `${this.selectedAltura} ${this.selectedUnidad}`;
      this.onChange(this.value); // actualiza el ngModel
      this.onTouched();
    }
    this.modal.dismiss();
  }

  /**
 * Se ejecuta cuando el modal fue completamente cerrado.
 *
 * Marca el control como "tocado" para que el formulario pueda disparar
 * validaciones o cambiar el estado visual.
 *
 * @returns {void}
 */
  onDidDismiss() {
    this.onTouched();
  }

  /**
 * Maneja el cambio de la altura seleccionada dentro del modal.
 *
 * Obtiene el valor numérico del evento Ionic (`event.detail.value`) y lo
 * guarda en `selectedAltura`. No dispara `onChange` acá porque el usuario
 * aún no confirmó el modal.
 *
 * @param {any} fn - Evento emitido por el componente de selección (ion-select / ion-picker).
 * @returns {void}
 */
  onAlturaChange(fn: any) {
    this.selectedAltura = Number(fn.detail.value);
  }

  /**
 * Maneja el cambio de la unidad de medida dentro del modal.
 *
 * Actualiza `selectedUnidad` con el valor elegido por el usuario. Tampoco
 * dispara `onChange` acá porque la confirmación ocurre en `closeModal(...)`.
 *
 * @param {any} fn - Evento emitido por el componente de selección de unidad.
 * @returns {void}
 */
  onUnidadChange(fn: any) {
    this.selectedUnidad = fn.detail.value;
  }

  /**
 * Escribe un valor en el control desde el formulario padre.
 *
 * Forma parte de la interfaz `ControlValueAccessor`. Angular la usa cuando
 * quiere establecer el valor inicial o cuando hace un `reset` del formulario.
 *
 * @param {any} value - Valor a escribir (por ejemplo: `"175 cm"`).
 * @returns {void}
 */
  writeValue(value: any): void {
    this.value = value;
  }

  /**
   * Registra la función que se debe llamar cuando el valor cambie.
   *
   * Angular pasa esta función (`fn`) y el componente la guarda en `onChange`
   * para usarla cuando el usuario confirme el modal. Así el formulario sabe
   * que el valor cambió.
   *
   * @param {(value: string) => void} fn - Función de callback para cambios de valor.
   * @returns {void}
   */
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  /**
   * Registra la función que se debe llamar cuando el control sea marcado como tocado.
   *
   * Angular pasa esta función (`fn`) y el componente la llama en varios momentos:
   * al cerrar el modal o al terminar la interacción, para que el formulario pueda
   * actualizar el estado de "tocado".
   *
   * @param {() => void} fn - Función de callback para el estado de "tocado".
   * @returns {void}
   */
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
}
