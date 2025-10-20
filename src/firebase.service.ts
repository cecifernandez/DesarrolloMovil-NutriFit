import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app';
import { RegisterForm } from './app/models/register.models';
import { LoginForm } from './app/models/login.models';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  constructor(private afAuth: AngularFireAuth) {}

  // Register user
  register(inputs: RegisterForm) {
    const { email, password } = inputs;

    return this.afAuth.createUserWithEmailAndPassword(email, password);
  }

  // LogIn user
  login(inputs: LoginForm) {
    const { email, password } = inputs;
    
    return this.afAuth.signInWithEmailAndPassword(email, password);
  }

  // LogOut user
  logout() {
    return this.afAuth.signOut();
  }

  // LogIn con Google 
  loginWithGoogle() {
    const provider = new firebase.auth.GoogleAuthProvider();
    return this.afAuth.signInWithPopup(provider);
  }
}