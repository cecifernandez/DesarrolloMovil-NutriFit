import { Injectable } from '@angular/core';

interface UserData {
  genero: string;
  peso: string | null;
  altura: string;
  profileImage?: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private user: UserData = {
    genero: '',
    peso: null,
    altura: '',
    profileImage: ''
  };

  constructor() {

    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      this.user = JSON.parse(savedUser);
    }
  }

  /**
   * Establece los datos del usuario y los guarda en localStorage para persistencia.
   *
   * @param data - Objeto con los datos del usuario: género, peso y altura.
   */

  setUser(data: UserData) {
    this.user = { ...this.user, ...data };
    localStorage.setItem('user', JSON.stringify((this.user)));
  }

  /**
   * Obtiene los datos actuales del usuario desde la variable interna.
   *
   * @returns Un objeto con los datos del usuario: género, peso y altura.
   */

  getUser() {
    return this.user;
  }

  /**
   * Guarda solo la imagen de perfil del usuario
   */
  setProfileImage(imageData: string) {
    this.user.profileImage = imageData;
    localStorage.setItem('user', JSON.stringify(this.user));
  }

  /**
   * Devuelve la imagen de perfil del usuario
   */
  getProfileImage(): string {
    return this.user.profileImage || '';
  }

}
