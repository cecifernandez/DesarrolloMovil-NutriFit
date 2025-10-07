import { Component, OnInit } from '@angular/core';

import { ButtonText } from '@/app/enum/button-text/button-text';
import { ButtonIcon } from '@/app/enum/button-icon/button-icon';
import { InputText } from '@/app/enum/input-text/input-text';

@Component({
  selector: 'welcome-nutri-fit',
  templateUrl: './welcome-nutri-fit.page.html',
  styleUrls: ['./welcome-nutri-fit.page.scss'],
  standalone: false
})
export class WelcomeNutriFitPage implements OnInit {
  ButtonText = ButtonText;
  ButtonIcon = ButtonIcon;

  InputText = InputText;

  constructor() { }

  ngOnInit() { }
}