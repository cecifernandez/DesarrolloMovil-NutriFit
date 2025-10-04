import { InputText } from '../../enum/input-text/input-text';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'input-text',
  templateUrl: './input-text.component.html',
  styleUrls: ['./input-text.component.scss'],
  standalone: false
})
export class InputTextComponent  implements OnInit {
  @Input() propEnum!: InputText;
  
  constructor() { }

  ngOnInit() {}

}
