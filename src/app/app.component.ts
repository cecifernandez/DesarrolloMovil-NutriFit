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
    this.initializeApp();
  }
  
  ngOnInit() {
    this.testFirebaseConnection();
  }

   async testFirebaseConnection() {
    try {
      const testCol = collection(this.firestore, 'test');
      const testDoc = await addDoc(testCol, {
        message: 'Conexión Firebase OK',
        timestamp: Timestamp.now(),
      });
      console.log('Conectado a Firebase. Documento creado con ID:', testDoc.id);
    } catch (error) {
      console.error('Error de conexión Firebase:', error);
    }
  }


  initializeApp() {
    this.platform.ready().then(() => {
      console.log('Plataforma lista');
    });

    
  }
}
