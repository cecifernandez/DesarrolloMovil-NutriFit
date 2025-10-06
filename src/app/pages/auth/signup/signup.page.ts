import { Component, OnInit } from '@angular/core';
import { FirebaseService } from 'src/firebase.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
  standalone: false
})
export class SignupPage implements OnInit {
  email: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private firebaseService: FirebaseService) { }

  ngOnInit() {
  }

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
