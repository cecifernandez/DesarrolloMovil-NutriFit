import { Injectable } from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithPopup,
  UserCredential,
  onAuthStateChanged
} from '@angular/fire/auth';
import {
 Firestore,
  collection,
  collectionData,
  doc,
  setDoc,
  Timestamp,
  getDoc
} from '@angular/fire/firestore';
import { RegisterForm } from '../models/register.models';
import { LoginForm } from '../models/login.models';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})


export class FirebaseService {


  constructor(private auth: Auth, private firestore: Firestore) {}

  /**
   * Registra un nuevo usuario y guarda sus datos en Firestore.
   */
  async register(inputs: RegisterForm): Promise<UserCredential> {
    const { email, password, username } = inputs;

    try {
      // Crear usuario en Firebase Authentication
      const result = await createUserWithEmailAndPassword(this.auth, email, password);

      // Guardar datos del usuario en Firestore
      if (result.user?.uid) {
        const userRef = doc(this.firestore, `users/${result.user.uid}`);
        await setDoc(userRef, {
          uid: result.user.uid,
          email,
          username: username ?? '',
          createdAt: Timestamp.now()
        });
      }

      return result;
    } catch (error) {
      console.error('Error al registrar usuario:', error);
      throw error;
    }
  }

  /**
   * Inicia sesión con email y contraseña.
   */
  login(inputs: LoginForm) {
    const { email, password } = inputs;
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  /**
   * Cierra sesión del usuario actual.
   */
  logout() {
    return signOut(this.auth);
  }

  /**
   * Inicia sesión con Google mediante un popup.
   */
 async isNewUser(uid: string): Promise<boolean> {
    const userRef = doc(this.firestore, `users/${uid}`);
    const userSnap = await getDoc(userRef);
    return !userSnap.exists(); // true si es nuevo
  }

  async loginWithGooglePopup() {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(this.auth, provider);

    if (result.user) {
      const userRef = doc(this.firestore, `users/${result.user.uid}`);
      await setDoc(
        userRef,
        {
          uid: result.user.uid,
          email: result.user.email,
          displayName: result.user.displayName ?? '',
          photoURL: result.user.photoURL ?? '',
          provider: 'google',
          createdAt: Timestamp.now()
        },
        { merge: true }
      );
    }

    return result;
  }
  /**
   * Envía correo para restablecer la contraseña.
   */
  resetPassword(email: string) {
    return sendPasswordResetEmail(this.auth, email);
  }

 
/**
   * Obtiene los datos del usuario actualmente autenticado.
   */
  async getCurrentUserData() {
    const user = this.auth.currentUser;
    if (!user) {
      throw new Error('Usuario no autenticado');
    }

    const userRef = doc(this.firestore, `users/${user.uid}`);
    const docSnap = await getDoc(userRef);
    return docSnap; // devuelve DocumentSnapshot
  }
  
  getUsers(): Observable<any[]> {
    const usersRef = collection(this.firestore, 'users');
    return collectionData(usersRef, { idField: 'id' }) as Observable<any[]>;
  }

  redirectIfAuthenticated(router: Router, fallbackRoute = '/home'): void {
    onAuthStateChanged(this.auth, (user) => {
      if (user) {
        router.navigate([fallbackRoute]);
      }
    });
  }
}
