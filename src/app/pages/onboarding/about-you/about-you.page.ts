import { Component, OnInit } from '@angular/core';

import { ButtonText } from '@/app/enum/button-text/button-text';
import { ButtonIcon } from '@/app/enum/button-icon/button-icon';

@Component({
  selector: 'about-you',
  templateUrl: './about-you.page.html',
  styleUrls: ['./about-you.page.scss'],
  standalone: false
})
export class AboutYouPage implements OnInit {
  ButtonText = ButtonText;
  ButtonIcon = ButtonIcon;

  constructor() { }

  ngOnInit() {
  }
}
