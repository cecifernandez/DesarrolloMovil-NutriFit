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
  ) {}

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

  async saveChanges() {
    const user = this.auth.currentUser;
    if (!user) return;

    const uid = user.uid;
    const userRef = doc(this.firestore, `users/${uid}`);

    try {
      // Actualizar Firestore
      await updateDoc(userRef, {
        username: this.username,
        weight: this.weight
      });

      // Cambiar contraseña si el usuario escribió algo
      if (this.newPassword.trim().length > 0) {
        await updatePassword(user, this.newPassword);
      }

      const toast = await this.toastCtrl.create({
        message: 'Perfil actualizado!',
        duration: 1800,
        color: 'success'
      });
      toast.present();

      this.router.navigate(['/profile']);

    } catch (err: any) {
      const toast = await this.toastCtrl.create({
        message: 'Error: ' + err.message,
        duration: 2000,
        color: 'danger'
      });
      toast.present();
    }
  }
}

