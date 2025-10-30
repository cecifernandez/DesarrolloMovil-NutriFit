import { Component, OnInit, Input,Output,EventEmitter} from '@angular/core';
import { ButtonText } from '@/app/enum/button-text/button-text';

@Component({
  selector: 'primary-button',
  templateUrl: './primary-button.component.html',
  styleUrls: ['./primary-button.component.scss'],
  standalone: false,
})
export class PrimaryButtonComponent implements OnInit {
  @Input() propEnum!: ButtonText;
  @Output() buttonClick = new EventEmitter<void>();
  
  constructor() { }

  ngOnInit() { }

  /**
 * Maneja el evento de clic del botón y lo propaga al componente padre.
 *
 * Esta función se ejecuta cuando el usuario hace clic en el botón del componente.
 * Su única responsabilidad es emitir el evento `buttonClick` para que el padre
 * pueda reaccionar.
 *
 * @returns {void}
 */
onClick(): void {
  this.buttonClick.emit();
}
}
