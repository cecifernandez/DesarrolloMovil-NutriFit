import { Component, Input, OnInit } from '@angular/core';
import { ButtonText } from '@/app/enum/button-text/button-text';
import { ButtonIcon } from '@/app/enum/button-icon/button-icon';

@Component({
  selector: 'secondary-button',
  templateUrl: './secondary-button.component.html',
  styleUrls: ['./secondary-button.component.scss'],
  standalone: false
})
export class SecondaryButtonComponent implements OnInit {
  @Input() propEnum!: ButtonText;
  @Input() iconName!: ButtonIcon;

  constructor() { }

  ngOnInit() { }

  validateIcon = (): void => {
    if(this.propEnum.includes('Regístrarse con Google')) {
      
    }
  }
}
