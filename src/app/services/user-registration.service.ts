import { Injectable } from "@angular/core";
import { UserProfile } from "../interfaces/user-profile.interface";
import { ObjectivePersonalModel } from "../models/objective.models";
import z from "zod";

type ObjectivePersonal = z.infer<typeof ObjectivePersonalModel>;

@Injectable({ providedIn: 'root' })
export class UserRegistrationService {
  private removeSensitiveFields<T extends Record<string, any>>(data: T): T {
    if (!data) return data;

    const { email, password, passwordConfirm, ...safeData } = data;
    return safeData as T;
  }

  private userData: Partial<UserProfile & ObjectivePersonal> = {};

  setData(partial: Partial<UserProfile & ObjectivePersonal>) {
    // Filtrar campos sensibles antes de guardar
    const filteredPartial = this.removeSensitiveFields(partial);

     // Fusionar con lo que ya había
    this.userData = { ...this.userData, ...filteredPartial };

    // También eliminar las claves sensibles antes de guardar al localStorage
    const filteredUserData = this.removeSensitiveFields(this.userData);

    localStorage.setItem('user', JSON.stringify((filteredUserData)));
  }

  getData(): Partial<UserProfile & ObjectivePersonal> {
    const stored = localStorage.getItem('user');

    if (stored) {
      this.userData = JSON.parse(stored);
    }

    return this.userData;
  }

  reset() {
    this.userData = {};
  }
}