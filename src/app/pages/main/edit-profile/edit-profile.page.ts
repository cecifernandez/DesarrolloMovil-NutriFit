import { Component, OnInit } from '@angular/core';
import { Auth, updatePassword } from '@angular/fire/auth';
import { Firestore, doc, getDoc, updateDoc } from '@angular/fire/firestore';
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.page.html',
  styleUrls: ['./edit-profile.page.scss'],
  standalone: false
})
export class EditProfilePage implements OnInit {

  username: string = '';
  weight: number | null = null;
  newPassword: string = '';

  constructor(
    private auth: Auth,
    private firestore: Firestore,
    private toastCtrl: ToastController,
    private router: Router
  ) { }

  async ngOnInit() {
    const user = this.auth.currentUser;
    if (!user) return;

    const userRef = doc(this.firestore, `users/${user.uid}`);
    const snap = await getDoc(userRef);

    if (snap.exists()) {
      const data: any = snap.data();
      this.username = data.username ?? '';
      this.weight = data.weight ?? null;
    }
  }

  /**
 * Guarda los cambios del perfil del usuario autenticado.
 *
 * El flujo es:
 * 1. Obtiene el usuario actual desde Firebase Auth. Si no hay usuario, sale.
 * 2. Construye la referencia al documento del usuario en Firestore (`users/{uid}`).
 * 3. Actualiza en Firestore los campos editables del perfil (por ahora `username` y `weight`).
 * 4. Si el usuario ingresó una nueva contraseña (`this.newPassword` no está vacía),
 *    también la actualiza en Firebase Auth con `updatePassword(...)`.
 * 5. Si todo sale bien, muestra un toast de éxito y navega al perfil.
 * 6. Si algo falla en cualquiera de los pasos, muestra un toast de error con el mensaje.
 *
 * Esta función mezcla actualización en **Firestore** (datos de perfil) y en **Auth**
 * (contraseña), por lo que debe ir en un `try/catch`.
 *
 * @async
 * @returns {Promise<void>}
 */
  async saveChanges(): Promise<void> {
    const user = this.auth.currentUser;
    if (!user) return;

    const uid = user.uid;
    const userRef = doc(this.firestore, `users/${uid}`);

    try {
      await updateDoc(userRef, {
        username: this.username,
        weight: this.weight,
      });

      if (this.newPassword.trim().length > 0) {
        await updatePassword(user, this.newPassword);
      }

      const toast = await this.toastCtrl.create({
        message: 'Perfil actualizado!',
        duration: 1800,
        color: 'success',
      });
      toast.present();

      this.router.navigate(['/profile']);
    } catch (err: any) {
      const toast = await this.toastCtrl.create({
        message: 'Error: ' + err.message,
        duration: 2000,
        color: 'danger',
      });
      toast.present();
    }
  }

}

