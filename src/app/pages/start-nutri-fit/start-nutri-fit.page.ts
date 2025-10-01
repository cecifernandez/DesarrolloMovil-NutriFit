import { Component, OnInit } from '@angular/core';
import { IonButton, IonLoading } from '@ionic/angular';

@Component({
  selector: 'app-start-nutri-fit',
  templateUrl: './start-nutri-fit.page.html',
  styleUrls: ['./start-nutri-fit.page.scss'],
  standalone: false
})
export class StartNutriFitPage implements OnInit {
  constructor() { }

  isLoading = true;

  ngOnInit() {
    setTimeout(() => {
      this.isLoading = false;
    }, 3500);
  }
}
