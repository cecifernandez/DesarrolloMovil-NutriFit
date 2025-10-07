import { Component, Input, OnInit } from '@angular/core';

import { ButtonText } from '@/app/enum/button-text/button-text';

@Component({
  selector: 'secondary-button',
  templateUrl: './secondary-button.component.html',
  styleUrls: ['./secondary-button.component.scss'],
  standalone: false
})
export class SecondaryButtonComponent  implements OnInit {
  @Input() propEnum!: ButtonText;
  
  constructor() { }

  ngOnInit() {}
}
