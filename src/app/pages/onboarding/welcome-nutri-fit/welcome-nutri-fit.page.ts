import { Component, OnInit } from '@angular/core';

import { ButtonText } from '@/app/enum/button-text/button-text';
import { Router } from '@angular/router';

@Component({
  selector: 'welcome-nutri-fit',
  templateUrl: './welcome-nutri-fit.page.html',
  styleUrls: ['./welcome-nutri-fit.page.scss'],
  standalone: false
})
export class WelcomeNutriFitPage implements OnInit {
  ButtonText = ButtonText;

  goToLoginWithEmail() {
    this.router.navigate(['./login']);
  }

  goToRegister() {
    this.router.navigate(['./register']);
  }

  constructor(private router: Router) { }

  ngOnInit() { }
}