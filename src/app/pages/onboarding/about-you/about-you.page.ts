import { Component, OnInit } from '@angular/core';

import { ButtonText } from '@/app/enum/button-text/button-text';
import { ButtonIcon } from '@/app/enum/button-icon/button-icon';

import { UserService } from '@/app/services/user';
import { AlertController } from '@ionic/angular';


@Component({
  selector: 'about-you',
  templateUrl: './about-you.page.html',
  styleUrls: ['./about-you.page.scss'],
  standalone: false
})
export class AboutYouPage implements OnInit {
  ButtonText = ButtonText;
  ButtonIcon = ButtonIcon;


  genero: string = '';
  peso: string | null = null;
  altura: string = '';

  constructor(
    private userService: UserService,
    private alertController: AlertController
  ) { }
  ngOnInit() { }

  onGeneroSeleccionado(valor: string) {
    console.log("Entre aqui")
    this.genero = valor;
  }

  onAlturaSeleccionada(valor: string) {
    this.altura = valor;
  }

  onPesoSeleccionado(valor: string) {
    this.peso = valor;
  }

  /**
   * Guarda los datos ingresados por el usuario si todos los campos están completos.
   * Si falta alguno, muestra una alerta informando que es necesario completarlos.
   * Al guardar, los datos se almacenan mediante el servicio UserService.
   */
  async guardarDatos() {
    if (!this.genero || !this.altura || !this.peso || this.peso === 'Peso') {
      await this.presentAlert('Por favor, completa todos los campos correctamente');
      return;
    }

    const user = {
      genero: this.genero,
      peso: this.peso,
      altura: this.altura,
    };

    this.userService.setUser(user);
    await this.presentAlert('Datos guardados correctamente');
  }

  async presentAlert(message: string) {
    const alert = await this.alertController.create({
      header: 'Atención',
      message: message,
      buttons: ['OK'],
    });

    await alert.present();
  }
}
