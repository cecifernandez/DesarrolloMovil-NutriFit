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
  register(inputs: RegisterForm) {
    const { email, password } = inputs;
    return this.afAuth.createUserWithEmailAndPassword(email, password);
  }

  /**
   * Inicia sesión de un usuario con email y contraseña.
   *
   * Utiliza Firebase Authentication para autenticar al usuario.
   *
   * @param {LoginForm} inputs - Objeto con email y password del usuario.
   * @returns {Promise<firebase.auth.UserCredential>} Resultado del inicio de sesión.
   */
  login(inputs: LoginForm) {
    const { email, password } = inputs;
    return this.afAuth.signInWithEmailAndPassword(email, password);
  }

  /**
   * Cierra la sesión del usuario actual.
   *
   * Llama a Firebase Authentication para cerrar la sesión activa.
   *
   * @returns {Promise<void>} Promesa que se resuelve cuando el usuario se desconecta.
   */
  logout() {
    return this.afAuth.signOut();
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
  async loginWithGooglePopup() {
    const provider = new firebase.auth.GoogleAuthProvider();
    const result = await this.afAuth.signInWithPopup(provider);

    if (!result.user) {
      throw new Error('No se pudo obtener el usuario de Google.');
    }

    return result; // devuelve UserCredential
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
  resetPassword(email: string) {
    return this.afAuth.sendPasswordResetEmail(email);
  }
}