import { Component, Input, ViewChild, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { IonModal } from '@ionic/angular';

@Component({
  selector: 'picker-genero',
  templateUrl: './picker-genero.component.html',
  styleUrls: ['./picker-genero.component.scss'],
  standalone: false,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PickerGeneroComponent),
      multi: true,
    },
  ],
})

export class PickerGeneroComponent implements ControlValueAccessor {
  @Input() value: string = '';

  @ViewChild(IonModal) modal!: IonModal;

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

  /**
   * Lista interna de opciones que mostrará el modal.
   *
   * Por defecto incluye `'Femenino'`, `'Masculino'` y `'Otro'`, pero puede
   * sobreescribirse desde el exterior mediante el `@Input() options`.
   *
   * @private
   * @type {string[]}
   */
  private _options: string[] = ['Femenino', 'Masculino', 'Otro'];

  /**
   * Permite establecer desde el exterior la lista de opciones disponibles.
   *
   * Si el valor recibido es un arreglo no vacío, reemplaza las opciones por
   * las nuevas. Esto permite reutilizar el componente para otros catálogos
   * (por ejemplo, género, tipo de documento, nivel de actividad, etc.).
   *
   * @param {string[]} value - Arreglo de opciones a mostrar en el modal.
   * @returns {void}
   */
  @Input()
  set options(value: string[]) {
    if (value && value.length) {
      this._options = value;
    }
  }

  /**
   * Devuelve la lista de opciones actual que el componente está usando.
   *
   * Se expone como getter para que la plantilla la pueda iterar.
   *
   * @returns {string[]} Arreglo de opciones vigentes.
   */
  get options(): string[] {
    return this._options;
  }

  /**
   * Valor seleccionado actualmente en el modal.
   *
   * Se separa de `this.value` porque el usuario puede cambiar la opción dentro
   * del modal pero recién se confirma cuando toca "Aceptar".
   *
   * @type {string}
   */
  currentValue: string = '';

  /**
   * Ciclo de vida de Angular que se ejecuta al inicializar el componente.
   *
   * Sincroniza el valor actual (`this.value`, que viene del formulario) con el
   * valor interno que se edita en el modal (`currentValue`), para que al abrir
   * el modal se vea la opción ya seleccionada.
   *
   * @returns {void}
   */
  ngOnInit(): void {
    this.currentValue = this.value;
  }

  /**
   * Abre el modal para seleccionar una opción.
   *
   * Llama a `present()` en el modal de Ionic. Normalmente se dispara desde un
   * `(click)` en el input o icono de selección.
   *
   * @returns {void}
   */
  openModal(): void {
    this.modal.present();
  }

  /**
   * Cierra el modal y, si se confirmó, propaga el valor al formulario.
   *
   * Si el `role` es `'confirm'`, asigna el valor seleccionado en el modal
   * (`currentValue`) al valor del control, llama a `onChange(...)` para que
   * el formulario se entere del cambio y a `onTouched()` para marcar el control
   * como tocado. Finalmente cierra el modal.
   *
   * @param {string} role - Rol con el que se cierra el modal (`'confirm'`, `'cancel'`, etc.).
   * @returns {void}
   */
  closeModal(role: string): void {
    if (role === 'confirm') {
      this.value = this.currentValue;
      this.onChange(this.value);
      this.onTouched();
    }
    this.modal.dismiss();
  }

  /**
   * Maneja el cambio de opción dentro del modal.
   *
   * Se ejecuta cada vez que el usuario selecciona una opción en el `ion-radio-group`
   * o elemento equivalente. Solo actualiza el valor interno; la confirmación real
   * se hace en `closeModal(...)`.
   *
   * @param {CustomEvent} event - Evento de Ionic con el valor seleccionado.
   * @returns {void}
   */
  onIonChange(event: CustomEvent): void {
    this.currentValue = event.detail.value as string;
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
   * Escribe un valor en el control desde el formulario padre.
   *
   * Forma parte de la interfaz `ControlValueAccessor`. Angular la usa cuando
   * quiere establecer el valor inicial o cuando se hace un reset.
   *
   * @param {any} value - Valor a escribir en el control (por ejemplo, "Femenino").
   * @returns {void}
   */
  writeValue(value: any): void {
    this.value = value;
  }

  /**
   * Registra la función que se debe ejecutar cuando cambie el valor del control.
   *
   * Angular pasa esta función y el componente la guarda para invocarla cuando
   * el usuario confirme el valor en el modal.
   *
   * @param {(value: any) => void} fn - Función de callback para cambios de valor.
   * @returns {void}
   */
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  /**
   * Registra la función que se debe ejecutar cuando el control sea marcado como tocado.
   *
   * Angular pasa esta función y el componente la llama en eventos como el cierre
   * del modal, para que el formulario reactive pueda marcar el control como `touched`.
   *
   * @param {() => void} fn - Función de callback para el estado de "tocado".
   * @returns {void}
   */
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
}
