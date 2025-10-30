import { Component, EventEmitter, forwardRef, Input, Output } from '@angular/core';

@Component({
  selector: 'objective',
  templateUrl: './objective.component.html',
  styleUrls: ['./objective.component.scss'],
  standalone: false,
})
export class ObjectiveComponent {
  @Input() label!: string;
  @Input() icon!: string;
  @Input() checked: boolean = false;
  @Input() disabled: boolean = false;

  @Output() checkedChange = new EventEmitter<boolean>();

  /**
 * Alterna el estado del control (on/off) y notifica el cambio.
 *
 * Si el control está deshabilitado (`disabled === true`), no realiza ninguna acción.
 * En caso contrario, invierte el valor actual de `checked` y emite el nuevo valor
 * mediante el `EventEmitter` `checkedChange` para que el componente padre pueda
 * reaccionar (por ejemplo, actualizar un formulario o guardar la preferencia).
 *
 * @returns {void}
 */
  toggle() {
    if (this.disabled) return;
    this.checked = !this.checked;
    this.checkedChange.emit(this.checked);
  }
}