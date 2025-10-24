import { Injectable } from "@angular/core";
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
  private removeSensitiveFields<T extends Record<string, any>>(data: T): T {
    if (!data) return data;

    const { email, password, passwordConfirm, ...safeData } = data;
    return safeData as T;
  }

  private userData: Partial<UserProfile & ObjectivePersonal> = {};

  /**
   * Guarda datos parciales del usuario en memoria y en `localStorage`.
   *
   * Filtra campos sensibles antes de almacenar. Fusiona los datos nuevos con los existentes.
   *
   * @param {Partial<UserProfile & ObjectivePersonal>} partial - Datos parciales a guardar.
   */
  setData(partial: Partial<UserProfile & ObjectivePersonal>) {
    // Filtrar campos sensibles antes de guardar
    const filteredPartial = this.removeSensitiveFields(partial);

    // Fusionar con lo que ya había
    this.userData = { ...this.userData, ...filteredPartial };

    // También eliminar las claves sensibles antes de guardar al localStorage
    const filteredUserData = this.removeSensitiveFields(this.userData);

    localStorage.setItem('user', JSON.stringify((filteredUserData)));
  }

  /**
   * Recupera los datos del usuario almacenados en `localStorage`.
   *
   * Si existen datos previos, los carga en memoria y los devuelve.
   *
   * @returns {Partial<UserProfile & ObjectivePersonal>} Datos del usuario.
   */
  getData(): Partial<UserProfile & ObjectivePersonal> {
    const stored = localStorage.getItem('user');

    if (stored) {
      this.userData = JSON.parse(stored);
    }

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
}