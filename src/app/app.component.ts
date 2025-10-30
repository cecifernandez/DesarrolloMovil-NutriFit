import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Firestore, collection, addDoc, Timestamp } from '@angular/fire/firestore';
import { inject } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  standalone: false
})
export class AppComponent {
  private firestore: Firestore;
  constructor(private platform: Platform) {
    this.firestore = inject(Firestore);
  }

  ngOnInit() { }

}
