import { Component, OnInit } from '@angular/core';

import { ButtonText } from '@/app/enum/button-text/button-text';

@Component({
  selector: 'app-start',
  templateUrl: './start.page.html',
  styleUrls: ['./start.page.scss'],
  standalone: false
})
export class StartPage {
  ButtonText = ButtonText;

  constructor() { }
}
