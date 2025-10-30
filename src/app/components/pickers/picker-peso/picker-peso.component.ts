
import { Component, OnInit, Input, EventEmitter, Output, ViewChild, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { IonModal } from '@ionic/angular';

@Component({
  selector: 'picker-peso',
  templateUrl: './picker-peso.component.html',
  styleUrls: ['./picker-peso.component.scss'],
  standalone: false,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PickerPesoComponent),
      multi: true,
    },
  ],
})
export class PickerPesoComponent implements ControlValueAccessor {
  @ViewChild(IonModal) modal!: IonModal;
  
  pesoNumeros: number[] = [];
  unidades: string[] = ['kg', 'lbs'];

  selectedPeso: number = 70;
  selectedUnidad: string = 'kg';
  value: string = '';

  /**
 * Función de callback que Angular usa para propagar cambios de valor al formulario.
 *
 * Se inicializa con una función vacía para evitar errores cuando el control
 * todavía no fue registrado por el `ControlValueAccessor`.
 *
 * @private
 * @type {(value: string) => void}
 */
private onChange: (value: string) => void = () => {};

/**
 * Función de callback que Angular usa para notificar que el control fue "tocado".
 *
 * Se inicializa con una función vacía para evitar errores cuando el control
 * todavía no fue registrado por el `ControlValueAccessor`.
 *
 * @private
 * @type {() => void}
 */
private onTouched: () => void = () => {};

ngOnInit(): void {
  this.pesoNumeros = Array.from({ length: 200 }, (_, i) => i + 1);
  this.value = `${this.selectedPeso} ${this.selectedUnidad}`;
}

/**
 * Abre el modal para seleccionar el peso.
 *
 * Llama al método `present()` del modal de Ionic para mostrarlo. Normalmente
 * se dispara desde un `(click)` en el input o en un icono de selección.
 *
 * @returns {void}
 */
openModal(): void {
  this.modal.present();
}

/**
 * Cierra el modal y, si el cierre fue por confirmación, actualiza el valor del control.
 *
 * Si el `role` es `'confirm'`, arma el texto de peso (`"70 kg"`, `"150 lb"`, etc.),
 * lo asigna al valor interno y llama a `onChange(...)` para notificar al formulario,
 * además de marcar el control como tocado con `onTouched()`. Finalmente cierra el modal.
 *
 * @param {string} role - Motivo/rol con el que se cierra el modal (`'confirm'`, `'cancel'`, etc.).
 * @returns {void}
 */
closeModal(role: string): void {
  if (role === 'confirm') {
    this.value = `${this.selectedPeso} ${this.selectedUnidad}`;
    this.onChange(this.value);
    this.onTouched();
  }
  this.modal.dismiss();
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
 * Maneja el cambio del peso seleccionado dentro del modal.
 *
 * Obtiene el valor desde `event.detail.value` (caso Ionic) o directamente
 * del valor pasado. Convierte a número y lo guarda en `selectedPeso`.
 *
 * @param {any} value - Evento o valor directo con el peso elegido.
 * @returns {void}
 */
onPesoChange(value: any): void {
  this.selectedPeso = Number(value.detail.value || value);
}

/**
 * Maneja el cambio de la unidad seleccionada dentro del modal.
 *
 * Actualiza `selectedUnidad` tomando el valor desde `event.detail.value`
 * o desde el propio parámetro (por si viene directo). No llama a `onChange`
 * aquí porque la confirmación se hace en `closeModal(...)`.
 *
 * @param {any} value - Evento o valor directo con la unidad elegida (por ejemplo, "kg" o "lb").
 * @returns {void}
 */
onUnidadChange(value: any): void {
  this.selectedUnidad = value.detail.value || value;
}

/**
 * Escribe un valor en el control desde el formulario padre.
 *
 * Forma parte de la interfaz `ControlValueAccessor`. Angular la usa cuando
 * quiere establecer el valor inicial o cuando hace un reset.
 *
 * @param {any} value - Valor a escribir (por ejemplo, `"80 kg"`).
 * @returns {void}
 */
writeValue(value: any): void {
  this.value = value;
}

/**
 * Registra la función que se debe llamar cuando cambie el valor del control.
 *
 * Angular pasa esta función (`fn`) y el componente la guarda para invocarla
 * cuando el usuario confirme el peso en el modal.
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
 * Angular pasa esta función (`fn`) y el componente la llama en eventos como el
 * cierre del modal, para que el formulario reactive pueda marcar el control como `touched`.
 *
 * @param {() => void} fn - Función de callback para notificar el estado de "tocado".
 * @returns {void}
 */
registerOnTouched(fn: any): void {
  this.onTouched = fn;
}

}
