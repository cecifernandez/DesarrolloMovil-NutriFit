import { Injectable } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
  onAuthStateChanged,
  UserCredential
} from 'firebase/auth';
import { RegisterForm } from './app/models/register.models';
import { LoginForm } from './app/models/login.models';
import { Router } from '@angular/router';
import { doc, Firestore, getDoc } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  constructor(private auth: Auth, private firestore: Firestore) { }

  /**
   * Registra un nuevo usuario con email y contraseña.
   *
   * Esta función utiliza Firebase Authentication para crear un usuario
   * con correo electrónico y contraseña. Devuelve una promesa con
   * el resultado de la creación del usuario.
   *
   * @param {RegisterForm} inputs - Objeto con email y password del usuario.
   * @returns {Promise<firebase.auth.UserCredential>} Resultado de la creación de usuario.
   */
  register(inputs: RegisterForm): Promise<UserCredential> {
    const { email, password } = inputs;
    return createUserWithEmailAndPassword(this.auth, email, password);
  }

  /**
   * Inicia sesión de un usuario con email y contraseña.
   *
   * Utiliza Firebase Authentication para autenticar al usuario.
   *
   * @param {LoginForm} inputs - Objeto con email y password del usuario.
   * @returns {Promise<firebase.auth.UserCredential>} Resultado del inicio de sesión.
   */
  login(inputs: LoginForm): Promise<UserCredential> {
    const { email, password } = inputs;
    return signInWithEmailAndPassword(this.auth, email, password);
  }


  /**
   * Cierra la sesión del usuario actual.
   *
   * Llama a Firebase Authentication para cerrar la sesión activa.
   *
   * @returns {Promise<void>} Promesa que se resuelve cuando el usuario se desconecta.
   */
  logout(): Promise<void> {
    return signOut(this.auth);
  }

  /**
   * Inicia sesión o registra un usuario con Google mediante un popup.
   *
   * Esta función abre un popup de autenticación de Google. Devuelve
   * el objeto UserCredential que contiene información del usuario
   * autenticado y, si corresponde, información adicional.
   *
   * @async
   * @throws {Error} Si no se puede obtener el usuario de Google.
   * @returns {Promise<firebase.auth.UserCredential>} Resultado del login con Google.
   */
  async loginWithGooglePopup(): Promise<UserCredential> {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(this.auth, provider);
    if (!result.user) throw new Error('No se pudo obtener el usuario de Google.');
    return result;
  }

  /**
   * Envía un correo para restablecer la contraseña del usuario.
   *
   * Esta función utiliza Firebase Authentication para enviar un email
   * al usuario con instrucciones para restablecer su contraseña.
   *
   * @param {string} email - Correo electrónico del usuario que desea restablecer la contraseña.
   * @returns {Promise<void>} Promesa que se resuelve cuando el email es enviado.
   */
  resetPassword(email: string): Promise<void> {
    return sendPasswordResetEmail(this.auth, email);
  }

  /**
   * Redirige al usuario si ya tiene una sesión activa.
   *
   * Este método consulta el estado actual de autenticación mediante Firebase.
   * Si el usuario está logueado, lo redirige a la ruta especificada (por defecto, '/home').
   *
   * @param {Router} router - Instancia del enrutador de Angular para realizar la navegación.
   * @param {string} [fallbackRoute='/home'] - Ruta a la que se redirige si el usuario está autenticado.
   * @returns {void}
 */
  redirectIfAuthenticated(router: Router, fallbackRoute = '/home'): void {
    onAuthStateChanged(this.auth, (user) => {
      if (user) {
        router.navigate([fallbackRoute]);
      }
    });
  }

  async isNewUser(uid: string): Promise<boolean> {
    const userRef = doc(this.firestore, `users/${uid}`);
    const userSnap = await getDoc(userRef);
    return !userSnap.exists(); // true si es nuevo}
  }
}