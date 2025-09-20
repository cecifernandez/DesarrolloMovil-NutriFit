import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { WelcolmeNutriFitPage } from './welcolme-nutri-fit.page';

const routes: Routes = [
  {
    path: '',
    component: WelcolmeNutriFitPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WelcolmeNutriFitPageRoutingModule {}
