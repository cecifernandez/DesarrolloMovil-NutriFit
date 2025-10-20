import { Injectable } from "@angular/core";
import { UserProfile } from "../interfaces/user-profile.interface";
import { ObjectivePersonalModel } from "../models/objective.models";
import z from "zod";

type ObjectivePersonal = z.infer<typeof ObjectivePersonalModel>;

@Injectable({ providedIn: 'root' })
export class UserRegistrationService {
  private userData: Partial<UserProfile & ObjectivePersonal> = {};

  setData(partial: Partial<UserProfile & ObjectivePersonal>) {
    this.userData = { ...this.userData, ...partial };
    localStorage.setItem('user', JSON.stringify((this.userData)));
  }

  getData(): Partial<UserProfile & ObjectivePersonal> {
    const stored = localStorage.getItem('user');
    if (stored) {
      this.userData = JSON.parse(stored); // <-- parseamos el string a objeto
    }
    return this.userData;
  }

  reset() {
    this.userData = {};
  }
}