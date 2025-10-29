import { Injectable } from "@angular/core";
import { Firestore, doc, setDoc, Timestamp, getDoc } from "@angular/fire/firestore";
import { Auth } from "@angular/fire/auth";
import { UserProfile } from "../interfaces/user-profile.interface";
import { ObjectivePersonalModel } from "../models/objective.models";
import z from "zod";

type ObjectivePersonal = z.infer<typeof ObjectivePersonalModel>;

/**
 * Servicio para gestionar el registro progresivo del usuario.
 *
 * Permite almacenar y recuperar datos del usuario durante el proceso de onboarding,
 * filtrando campos sensibles y utilizando `localStorage` como almacenamiento temporal.
 * Combina datos del perfil (`UserProfile`) y objetivos personales (`ObjectivePersonal`).
 */
@Injectable({ providedIn: 'root' })
export class UserRegistrationService {
  /**
   * Elimina campos sensibles como `email`, `password` y `passwordConfirm` de un objeto.
   *
   * Este método se utiliza para evitar almacenar información sensible en `localStorage`.
   *
   * @template T - Tipo genérico del objeto de entrada.
   * @param {T} data - Objeto que puede contener campos sensibles.
   * @returns {T} Objeto sin los campos sensibles.
   */
  private userData: Partial<UserProfile & ObjectivePersonal> = {};

  constructor(private firestore: Firestore, private auth: Auth) { }

  private removeSensitiveFields<T extends Record<string, any>>(data: T): T {
    if (!data) return data;

    const { email, password, passwordConfirm, ...safeData } = data;
    return safeData as T;
  }


  /**
   * Guarda datos parciales del usuario en memoria y en `localStorage`.
   *
   * Filtra campos sensibles antes de almacenar. Fusiona los datos nuevos con los existentes.
   *
   * @param {Partial<UserProfile & ObjectivePersonal>} partial - Datos parciales a guardar.
   */
  async setData(partial: Partial<UserProfile & ObjectivePersonal>) {
    // Filtrar campos sensibles antes de guardar
    const filteredPartial = this.removeSensitiveFields(partial);

    // Fusionar con lo que ya había
    this.userData = { ...this.userData, ...filteredPartial };

    if (!this.auth.currentUser) {
      throw new Error('Usuario no autenticado');
    }

    const uid = this.auth.currentUser.uid;
    const userRef = doc(this.firestore, `users/${uid}`);
    await setDoc(userRef, {
      ...this.userData,
      updatedAt: Timestamp.now()
    }, { merge: true });

  }

  async loadUserFromFirestore() {
    const user = this.auth.currentUser;
    if (!user) {
      console.warn('loadUserFromFirestore: No hay usuario autenticado.');
      return null;
    }

    const userRef = doc(this.firestore, `users/${user.uid}`);
    const docSnap = await getDoc(userRef);

    if (docSnap.exists()) {
      this.userData = docSnap.data() as Partial<UserProfile & ObjectivePersonal>;
      return this.userData;
    } else {
      console.warn('loadUserFromFirestore: No se encontraron datos para el usuario.');
      return null;
    }
  }

  /**
   * Recupera los datos del usuario almacenados en `localStorage`.
   *
   * Si existen datos previos, los carga en memoria y los devuelve.
   *
   * @returns {Partial<UserProfile & ObjectivePersonal>} Datos del usuario.
   */
  getData(): Partial<UserProfile & ObjectivePersonal> {

    return this.userData;
  }

  /**
   * Reinicia los datos del usuario en memoria.
   *
   * No elimina los datos de `localStorage`, solo limpia el estado interno.
   */
  reset() {
    this.userData = {};
  }

  async saveToFirestore() {
    if (!this.auth.currentUser) {
      throw new Error('Usuario no autenticado');
    }

    const uid = this.auth.currentUser.uid;
    const filteredData = this.removeSensitiveFields(this.userData);

    const userRef = doc(this.firestore, `users/${uid}`);
    await setDoc(userRef, {
      ...filteredData,
      updatedAt: Timestamp.now()
    }, { merge: true }); // merge:true para no sobrescribir datos existentes
  }
}
