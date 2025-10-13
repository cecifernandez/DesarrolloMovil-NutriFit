import { Component, OnInit, Input,Output,EventEmitter} from '@angular/core';
import { ButtonText } from '../../enum/button-text/button-text';

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

   onClick() {
    this.buttonClick.emit();
  }
}
