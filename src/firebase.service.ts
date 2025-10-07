import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, GoogleAuthProvider, UserCredential,signInWithPopup } from 'firebase/auth';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  constructor() { }

  // Registrar usuario
  register(email: string, password: string): Promise<UserCredential> {
    return createUserWithEmailAndPassword(auth, email, password);
  }

  // Login usuario
  login(email: string, password: string): Promise<UserCredential> {
    return signInWithEmailAndPassword(auth, email, password);
  }

  // Login con Google
  loginWithGoogle(): Promise<UserCredential> {
    const provider = new GoogleAuthProvider();
    return signInWithPopup(auth, provider);
  }

  // Logout usuario
  logout(): Promise<void> {
    return signOut(auth);
  }
}

const app = initializeApp(environment.firebaseConfig);
const auth = getAuth(app);