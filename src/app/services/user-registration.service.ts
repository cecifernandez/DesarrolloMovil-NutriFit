import { Injectable } from "@angular/core";
import { UserProfile } from "../interfaces/user-profile.interface";
import { ObjectivePersonalModel } from "../models/objective.models";
import z from "zod";

type ObjectivePersonal = z.infer<typeof ObjectivePersonalModel>;

@Injectable({ providedIn: 'root' })
export class UserRegistrationService {
  private userData: Partial<UserProfile> = {};

  setData(partial: Partial<UserProfile & ObjectivePersonal>) {
    this.userData = { ...this.userData, ...partial };
  }

  getData(): Partial<UserProfile> {
    return this.userData;
  }

  reset() {
    this.userData = {};
  }
}