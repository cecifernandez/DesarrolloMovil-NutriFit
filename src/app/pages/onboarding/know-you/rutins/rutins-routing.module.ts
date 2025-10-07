import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RutinsPage } from './rutins.page';

const routes: Routes = [
  {
    path: '',
    component: RutinsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RutinsPageRoutingModule {}
