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
    {
      name: 'foods',
      icon: ButtonIcon.foods,
      label: ButtonText.foods,
      route: '/foods',
      currentIconPath: '',
    },
    {
      name: 'profile',
      icon: ButtonIcon.profile,
      label: ButtonText.profile,
      route: '/profile',
      currentIconPath: '',
    },
  ];

  constructor(private router: Router) {}

  ngOnInit() {
    // Nos suscribimos a los eventos del router de Angular
    this.router.events
      // Filtramos para escuchar solo los eventos de tipo NavigationEnd
      // NavigationEnd indica que la navegación terminó correctamente
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        // Obtenemos la URL final después de cualquier redirección
        const currentRoute = event.urlAfterRedirects.replace('/', '');

        // Guardamos la pestaña activa según la ruta
        // Si no hay ruta, se usa 'home' como valor por defecto
        this.activeTab = currentRoute || 'home';

        // Llamamos a un método que actualiza los iconos de las pestañas
        this.updateTabIcons();
      });

    // Llamamos nuevamente a updateTabIcons para inicializar los iconos al cargar el componente
    this.updateTabIcons();
  }

  navigate(tab: any) {
    this.activeTab = tab.name;
    this.router.navigate([tab.route]);
  }

  updateTabIcons() {
    this.tabs = this.tabs.map((tab) => ({
      ...tab,
      currentIconPath: `assets/svg/${tab.icon}/${
        this.activeTab === tab.name ? 'active' : 'disable'
      }.svg`,
    }));
  }
}
