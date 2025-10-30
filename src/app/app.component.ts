import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Firestore, collection, addDoc, Timestamp } from '@angular/fire/firestore';
import { inject } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  standalone: false
})
export class AppComponent {
  private firestore: Firestore;
  constructor(private platform: Platform) {
    this.firestore = inject(Firestore);
    this.initializeApp();
  }

  ngOnInit() { }

  /**
 * Inicializa la aplicación una vez que la plataforma de Ionic/Capacitor está lista.
 *
 * Llama a `this.platform.ready()` para asegurarse de que todos los plugins nativos
 * y el entorno estén disponibles antes de ejecutar lógica dependiente del dispositivo.
 * En este ejemplo solo registra un mensaje en consola, pero este es el lugar ideal
 * para:
 * - Configurar el idioma
 * - Registrar servicios nativos
 * - Ocultar el splash screen
 * - Configurar notificaciones
 *
 * @returns {void}
 */
  initializeApp(): void {
    this.platform.ready().then(() => {
      console.log('Plataforma lista');
    });
  }

}
