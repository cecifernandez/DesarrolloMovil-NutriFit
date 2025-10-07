import { Component, OnInit } from '@angular/core';

import { ButtonIcon } from '@/app/enum/button-icon/button-icon';
import { ButtonText } from '@/app/enum/button-text/button-text';
import { InputText } from '@/app/enum/input-text/input-text';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false
})
export class LogInPage implements OnInit {
  ButtonText = ButtonText;
  ButtonIcon = ButtonIcon;

  ButtonInputEmail = InputText;
  ButtonInputPassword = InputText;
  
  constructor() { }
  
  ngOnInit() { }
}
