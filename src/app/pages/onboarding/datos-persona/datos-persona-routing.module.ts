import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DatosPersonaPage } from './datos-persona.page';
const routes: Routes = [
  {
    path: '',
    component: DatosPersonaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DatosPersonaPageRoutingModule {}
