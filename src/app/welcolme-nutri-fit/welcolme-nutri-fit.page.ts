import { Component, OnInit } from '@angular/core';

import { ButtonText } from '../enum/button-text/button-text';
import { ButtonIcon } from '../enum/button-icon/button-icon';

@Component({
  selector: 'app-welcolme-nutri-fit',
  templateUrl: './welcolme-nutri-fit.page.html',
  styleUrls: ['./welcolme-nutri-fit.page.scss'],
  standalone: false
})
export class WelcolmeNutriFitPage implements OnInit {
  ButtonText = ButtonText;
  ButtonIcon = ButtonIcon;

  constructor() { }

  ngOnInit() { }
}
