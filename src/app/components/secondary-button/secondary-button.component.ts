import { Component, Input, OnInit, Output, EventEmitter, HostBinding } from '@angular/core';

import { ButtonText } from '@/app/enum/button-text/button-text';

@Component({
  selector: 'secondary-button',
  templateUrl: './secondary-button.component.html',
  styleUrls: ['./secondary-button.component.scss'],
  standalone: false
})
export class SecondaryButtonComponent implements OnInit {
  @Input() propEnum!: ButtonText;
  @Input() active: boolean = false;

  @Output() buttonClick = new EventEmitter<void>();

  @HostBinding('class.active') get isActive() {
    return this.active;
  }
  /**
 * Maneja el evento de clic del botón y lo propaga al componente padre.
 *
 * Esta función se ejecuta cuando el usuario hace clic en el botón del componente.
 * Su única responsabilidad es emitir el evento `buttonClick` para que el padre
 * pueda reaccionar (por ejemplo, guardar un formulario, abrir un modal, navegar, etc.).
 *
 * @returns {void}
 */
  onClick(): void {
    this.buttonClick.emit();
  }


  constructor() { }

  ngOnInit() { }


}