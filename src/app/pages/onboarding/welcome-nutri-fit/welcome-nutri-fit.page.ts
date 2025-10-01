import { Component, OnInit } from '@angular/core';

import { ButtonText } from '../../../enum/button-text/button-text';
import { ButtonIcon } from '../../../enum/button-icon/button-icon';

@Component({
  selector: 'welcome-nutri-fit',
  templateUrl: './welcome-nutri-fit.page.html',
  styleUrls: ['./welcome-nutri-fit.page.scss'],
  standalone: false
})
export class WelcomeNutriFitPage implements OnInit {
  ButtonText = ButtonText;
  ButtonIcon = ButtonIcon;

  constructor() { }

  ngOnInit() { }
}
