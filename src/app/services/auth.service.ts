import { Injectable } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { onAuthStateChanged, User } from 'firebase/auth';

/**
 * Servicio de autenticación que encapsula operaciones básicas con Firebase Auth.
 *
 * Proporciona métodos para obtener el usuario actual y cerrar sesión.
 * Utiliza la API moderna de Firebase (@angular/fire/auth).
 */
@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(private auth: Auth) {}

  /**
   * Obtiene el usuario actualmente autenticado.
   *
   * Este método escucha el estado de autenticación mediante `onAuthStateChanged`,
   * y devuelve una promesa con el usuario si está logueado, o `null` si no lo está.
   * Se utiliza para verificar sesión activa en guards o componentes.
   *
   * @returns {Promise<User | null>} Promesa con el usuario autenticado o `null`.
   */
  getCurrentUser(): Promise<User | null> {
    return new Promise((resolve) => {
      const unsubscribe = onAuthStateChanged(this.auth, (user) => {
        unsubscribe();
        resolve(user);
      });
    });
  }

  /**
   * Cierra la sesión del usuario actual.
   *
   * Llama al método `signOut()` de Firebase Auth para finalizar la sesión activa.
   * Se utiliza en botones de logout o al limpiar datos locales.
   *
   * @returns {Promise<void>} Promesa que se resuelve cuando la sesión se cierra.
   */
  logout() {
    return this.auth.signOut();
  }
}
