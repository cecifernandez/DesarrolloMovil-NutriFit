import { Component, OnInit } from '@angular/core';
import { ButtonText } from '@/app/enum/button-text/button-text';
import { UserRegistrationService } from '@/app/services/user-registration.service';
import { ActivatedRoute, Router } from '@angular/router';
import {
  ObjectivePersonalModel,
} from '@/app/models/objective.models';
import { ToastController } from '@ionic/angular';
import { ZodError } from 'zod';

type ObjectivePerson = {
  mejorarSalud: boolean;
  bajarPeso: boolean;
  ganarMasaMuscular: boolean;
  reducirEstres: boolean;
  dormirMejor: boolean;
  otro: string;
};

type ObjectiveKey = Exclude<keyof ObjectivePerson, 'otro'>;

@Component({
  selector: 'app-objective',
  templateUrl: './objective.page.html',
  styleUrls: ['./objective.page.scss'],
  standalone: false,
})
export class ObjectivePage implements OnInit {
  ButtonText = ButtonText;
  value: boolean = false;

  errorMessage: string = '';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private userRegistrationService: UserRegistrationService,
    private toastController: ToastController
  ) { }

  ngOnInit() { }

  /**
  * Navega al paso anterior del flujo de registro/onboarding.
  *
  * Usa navegación relativa para volver a la ruta `../about-person` tomando
  * como referencia la ruta actual. Esto permite mantener el wizard en orden.
  *
  * @returns {void}
  */
  backAboutPerson(): void {
    this.router.navigate(['../about-person'], { relativeTo: this.route });
  }

  /**
   * Estado local de los objetivos seleccionados por el usuario.
   *
   * Se inicializa en `false` para todos los objetivos y con `otro` vacío.
   * Este objeto es el que se valida luego con Zod antes de avanzar de paso.
   *
   * @type {ObjectivePerson}
   */
  objectivePerson: ObjectivePerson = {
    mejorarSalud: false,
    bajarPeso: false,
    ganarMasaMuscular: false,
    reducirEstres: false,
    dormirMejor: false,
    otro: '',
  };

  /**
   * Cantidad de objetivos actualmente seleccionados.
   *
   * Cuenta cuántos de los objetivos booleanos están en `true`. Además, si el
   * campo `otro` tiene texto no vacío, lo suma como un objetivo más.
   *
   * Esto se usa para mostrar feedback al usuario y también para validar
   * límites de selección.
   *
   * @returns {number} Número de objetivos seleccionados.
   */
  get selectedCount(): number {
    const {
      mejorarSalud,
      bajarPeso,
      ganarMasaMuscular,
      reducirEstres,
      dormirMejor,
    } = this.objectivePerson;

    let count = [
      mejorarSalud,
      bajarPeso,
      ganarMasaMuscular,
      reducirEstres,
      dormirMejor,
    ].filter((v) => v).length;

    if (this.objectivePerson.otro.trim() !== '') {
      count += 1;
    }

    return count;
  }

  /**
   * Indica si ya se alcanzó el mínimo de selección permitido.
   *
   * En este caso, considera que con al menos 1 objetivo ya se puede avanzar,
   * por eso devuelve `true` cuando `selectedCount > 0`.
   *
   * @returns {boolean} `true` si hay al menos un objetivo seleccionado.
   */
  get maxReached(): boolean {
    return this.selectedCount > 0;
  }

  /**
   * Maneja el cambio de estado de un objetivo (checkbox / toggle).
   *
   * - Actualiza el valor del objetivo correspondiente.
   * - Vuelve a contar cuántos objetivos hay marcados (incluyendo `otro` con texto).
   * - Si el usuario supera el máximo permitido (3 en este caso), revierte el cambio,
   *   fuerza un refresh del objeto y muestra un toast de error.
   *
   * Esto permite tener una UX controlada donde no se pueden elegir más de 3 objetivos.
   *
   * @param {ObjectiveKey} key - Clave del objetivo que cambió (ej. `'mejorarSalud'`).
   * @param {boolean} value - Nuevo valor del objetivo (`true` si se marcó).
   * @returns {Promise<void>}
   */
  async onObjectiveChange(key: ObjectiveKey, value: boolean): Promise<void> {
    this.objectivePerson[key] = value;

    const selectedCount = Object.entries(this.objectivePerson)
      .filter(([k, v]) => {
        if (k === 'otro') return this.objectivePerson.otro.trim() !== '';
        return v === true;
      }).length;

    if (selectedCount > 3) {
      this.objectivePerson[key] = false;

      setTimeout(() => {
        this.objectivePerson = { ...this.objectivePerson };
      });

      await this.mostrarErrorToast('Solo podés elegir hasta 3 objetivos.');
    }

    if (typeof this.objectivePerson[key] === 'boolean') {
      this.objectivePerson[key] = value;
    }
  }

  /**
   * Valida los objetivos seleccionados y avanza al siguiente paso del wizard.
   *
   * - Usa el esquema `ObjectivePersonalModel` (Zod) para validar que al menos
   *   un objetivo haya sido elegido o que el campo `otro` tenga contenido.
   * - Si la validación pasa, guarda los datos en el `userRegistrationService`
   *   y navega a la ruta `/routines`.
   * - Si la validación falla, captura el primer mensaje de error de Zod y lo
   *   muestra al usuario mediante un toast.
   *
   * @returns {void}
   */
  goNext(): void {
    try {
      const result = ObjectivePersonalModel.safeParse(this.objectivePerson);

      if (!result.success) {
        throw result.error;
      }

      const { data } = result;

      this.userRegistrationService.setData(data);

      this.router.navigate(['/routines'], { relativeTo: this.route });
    } catch (error: unknown) {
      let errorMsg =
        'Hubo un error en la aplicación, intenta nuevamente más tarde.';

      if (error instanceof ZodError) {
        const errores = error.issues || [];
        if (errores && errores.length > 0) {
          errorMsg = errores[0].message;
        }
      } else {
        console.error(error);
      }

      this.errorMessage = errorMsg;
      this.mostrarErrorToast(errorMsg);
    }
  }

  /**
   * Muestra un mensaje de error en un toast centrado.
   *
   * Se usa para dar feedback rápido al usuario cuando excede el máximo de
   * objetivos permitidos o cuando la validación de Zod falla.
   *
   * @param {string} message - Mensaje que se mostrará en el toast.
   * @returns {Promise<void>} Promesa que se resuelve cuando el toast fue presentado.
   */
  async mostrarErrorToast(message: string): Promise<void> {
    const toast = await this.toastController.create({
      message,
      duration: 3000,
      color: 'danger',
      position: 'middle',
    });
    await toast.present();
  }

}
