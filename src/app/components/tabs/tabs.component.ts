import { Component, Input, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

import { filter } from 'rxjs/operators';

import { ButtonText } from '@/app/enum/button-text/button-text';
import { ButtonIcon } from '@/app/enum/button-icon/button-icon';
import { Tab } from '@/app/interfaces/tab.interface';

@Component({
  selector: 'tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss'],
  standalone: false,
})
export class TabsComponent implements OnInit {
  @Input() activeTab: string = 'home';

  tabs: Tab[] = [
    {
      name: 'home',
      icon: ButtonIcon.home,
      label: ButtonText.home,
      route: '/home',
      currentIconPath: '',
    },
    {
      name: 'routines',
      icon: ButtonIcon.routines,
      label: ButtonText.routines,
      route: '/routines',
      currentIconPath: '',
    },
    // {
    //   name: 'foods',
    //   icon: ButtonIcon.foods,
    //   label: ButtonText.foods,
    //   route: '/foods',
    //   currentIconPath: '',
    // },
    {
      name: 'profile',
      icon: ButtonIcon.profile,
      label: ButtonText.profile,
      route: '/profile',
      currentIconPath: '',
    },
  ];

  constructor(private router: Router) { }

  ngOnInit() {
    this.router.events

      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        const currentRoute = event.urlAfterRedirects.replace('/', '');


        this.activeTab = currentRoute || 'home';

        this.updateTabIcons();
      });

    this.updateTabIcons();
  }

  /**
 * Navega a la ruta asociada a la pestaña seleccionada y la marca como activa.
 *
 * Se suele llamar desde la vista al hacer clic/tap en una pestaña. Actualiza
 * primero `activeTab` para que el UI cambie de estado y luego usa el `router`
 * de Angular para navegar a la ruta definida en la pestaña.
 *
 * @param {{ name: string; route: string; icon?: string }} tab - Objeto de la pestaña seleccionada.
 * @returns {void}
 */
  navigate(tab: any): void {
    this.activeTab = tab.name;
    this.router.navigate([tab.route]);
  }

  /**
   * Actualiza dinámicamente los íconos de cada pestaña según cuál esté activa.
   *
   * Recorre el arreglo `tabs` y a cada elemento le agrega/modifica la propiedad
   * `currentIconPath` apuntando al ícono correspondiente:
   * - Usa la ruta base `assets/svg/{tab.icon}/`.
   * - Si la pestaña es la activa, usa la variante `active.svg`.
   * - Si no, usa la variante `disable.svg`.
   *
   * Esto permite tener dos versiones del mismo ícono (activa e inactiva) sin
   * tener que manejarlo en la plantilla.
   *
   * @returns {void}
   */
  updateTabIcons(): void {
    this.tabs = this.tabs.map((tab) => ({
      ...tab,
      currentIconPath: `assets/svg/${tab.icon}/${this.activeTab === tab.name ? 'active' : 'disable'
        }.svg`,
    }));
  }
}
