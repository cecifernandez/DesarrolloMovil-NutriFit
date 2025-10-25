import { Injectable } from "@angular/core";
import { Firestore, doc, setDoc, Timestamp, getDoc } from "@angular/fire/firestore";
import { Auth } from "@angular/fire/auth";
import { UserProfile } from "../interfaces/user-profile.interface";
import { ObjectivePersonalModel } from "../models/objective.models";
import z from "zod";

type ObjectivePersonal = z.infer<typeof ObjectivePersonalModel>;

@Injectable({ providedIn: 'root' })
export class UserRegistrationService {
  private userData: Partial<UserProfile & ObjectivePersonal> = {};

  constructor(private firestore: Firestore, private auth: Auth) {}
 
  private removeSensitiveFields<T extends Record<string, any>>(data: T): T {
    if (!data) return data;

    const { email, password, passwordConfirm, ...safeData } = data;
    return safeData as T;
  }

 

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

  getData(): Partial<UserProfile & ObjectivePersonal> {

    return this.userData;
  }

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