import { Component, EventEmitter, Input, Output, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

@Component({
  selector: 'input-text-with-icon',
  templateUrl: './input-text-with-icon.component.html',
  styleUrls: ['./input-text-with-icon.component.scss'],
  standalone: false,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputTextWithIconComponent),
      multi: true
    }
  ]
})
export class InputTextWithIconComponent implements ControlValueAccessor {
  @Input() iconPath!: string;
  @Input() label!: string;
  @Input() type: string = 'text';  
  @Input() value: string = '';
  @Input() readonly: boolean = false;
  @Input() disabled: boolean = false;

  @Output() onClick = new EventEmitter<void>();

  
  showPassword = false;

  /**
 * Alterna la visibilidad de la contraseña en el input.
 *
 * Cambia el valor de `showPassword` entre `true` y `false`. Esto se usa junto
 * con los getters `inputType` y `toggleIcon` para mostrar u ocultar el valor
 * real del campo y cambiar el ícono correspondiente.
 *
 * @returns {void}
 */
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  /**
 * Devuelve el tipo de input que debe mostrar el control.
 *
 * Si el tipo configurado NO es `password`, devuelve el tipo original.
 * Si es `password`, devuelve:
 * - `'text'` cuando `showPassword` es `true` (mostrar contraseña).
 * - `'password'` cuando `showPassword` es `false` (ocultar contraseña).
 *
 * Este getter suele enlazarse en la plantilla con `[type]="inputType"`.
 *
 * @returns {string} Tipo de input que debe usarse en el HTML.
 */
  get inputType(): string {
    if (this.type !== 'password') return this.type;
    return this.showPassword ? 'text' : 'password';
  }

  /**
 * Devuelve la ruta del ícono que se debe mostrar para el toggle de contraseña.
 *
 * Si el tipo no es `password`, no muestra ningún ícono.
 * Si es `password`, alterna entre el ícono de "mostrar" y el de "ocultar"
 * según el estado de `showPassword`.
 *
 * @returns {string} Ruta del ícono a mostrar o cadena vacía si no aplica.
 */
  get toggleIcon(): string {
    if (this.type !== 'password') return '';
    return this.showPassword
      ? 'assets/svg/icon-auth/password-show.svg'
      : 'assets/svg/icon-auth/password-hidden.svg';
  }

  /**
 * Función de callback utilizada por Angular para notificar cambios de valor.
 *
 * Se inicializa con una función vacía para evitar errores cuando el control
 * aún no fue registrado por el formulario reactivo.
 *
 * @private
 * @type {(value: any) => void}
 */
  private onChange: any = () => {};

  /**
 * Función de callback utilizada por Angular para notificar que el control fue "tocado".
 *
 * Se inicializa con una función vacía para evitar errores cuando el control
 * aún no fue registrado por el formulario reactivo.
 *
 * @private
 * @type {() => void}
 */
  private onTouched: () => void = () => {};

  /**
 * Establece el valor del control desde el formulario padre.
 *
 * Este método forma parte de la interfaz `ControlValueAccessor` y lo llama Angular
 * cuando quiere escribir un valor en el control personalizado (por ejemplo al
 * inicializar el formulario o al hacer un reset).
 *
 * @param {any} value - Valor que se va a escribir en el control.
 * @returns {void}
 */
  writeValue(value: any) {
    this.value = value;
  }

  
/**
 * Registra la función que Angular debe llamar cuando el valor del control cambie.
 *
 * Angular pasa esta función (`fn`) y el control la guarda en `onChange` para
 * invocarla cada vez que el usuario escriba algo. Esto permite que el control
 * personalizado participe del ciclo de formularios reactivos.
 *
 * @param {(value: any) => void} fn - Función que notifica el nuevo valor al formulario.
 * @returns {void}
 */
  registerOnChange(fn: any) {
    this.onChange = fn;
  }

  /**
 * Registra la función que Angular debe llamar cuando el control sea "tocado".
 *
 * Angular pasa esta función (`fn`) y el control la guarda en `onTouched` para
 * invocarla cuando haya una interacción del usuario (por ejemplo, blur). Esto
 * es útil para marcar el control como `touched` o disparar validaciones.
 *
 * @param {() => void} fn - Función que notifica al formulario que el control fue tocado.
 * @returns {void}
 */
  registerOnTouched(fn: any) {
    this.onTouched = fn;
  }

  /**
 * Maneja el cambio de valor del input HTML y lo propaga al formulario.
 *
 * Se ejecuta cuando el usuario escribe en el input. Actualiza la propiedad
 * interna `value`, notifica el cambio al formulario mediante `onChange(...)`
 * y también marca el control como "tocado" con `onTouched()`.
 *
 * @param {any} event - Evento de cambio proveniente del input (por ejemplo, `(input)` o `(ionInput)`).
 * @returns {void}
 */
  onInputChange(event: any) {
    const input = event.target as HTMLInputElement;
    this.value = input.value;
    this.onChange(this.value);
    this.onTouched();
  }
}