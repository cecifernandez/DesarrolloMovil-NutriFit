import { FirebaseService } from '@/firebase.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: false
})
export class RegisterPage implements OnInit {
  email: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private firebaseService: FirebaseService) { }

  ngOnInit() {}

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