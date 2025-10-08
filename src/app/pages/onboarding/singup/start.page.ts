import { Component } from '@angular/core';

import { ButtonText } from '@/app/enum/button-text/button-text';
import { FirebaseService } from '@/firebase.service';

@Component({
  selector: 'app-start',
  templateUrl: './start.page.html',
  styleUrls: ['./start.page.scss'],
  standalone: false
})
export class StartPage {
  email: string = '';
  password: string = '';
  errorMessage: string = '';
  ButtonText = ButtonText;

  constructor(private firebaseService: FirebaseService) { }

  async onSignup() {
    try {
      const userCredential = await this.firebaseService.register(this.email, this.password);

      console.log('Usuario registrado:', userCredential.user);
      alert('Cuenta creada con éxito');
    } catch (error: any) {
      console.error('Error en registro:', error.message);
      alert('Error: ' + error.message);
    }
  }
}