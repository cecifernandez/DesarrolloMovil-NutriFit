import { Component, OnInit } from '@angular/core';

import { ButtonText } from '@/app/enum/button-text/button-text';

@Component({
  selector: 'welcome-nutri-fit',
  templateUrl: './welcome-nutri-fit.page.html',
  styleUrls: ['./welcome-nutri-fit.page.scss'],
  standalone: false
})
export class WelcomeNutriFitPage implements OnInit {
  ButtonText = ButtonText;

  constructor() { }

  ngOnInit() { }
}