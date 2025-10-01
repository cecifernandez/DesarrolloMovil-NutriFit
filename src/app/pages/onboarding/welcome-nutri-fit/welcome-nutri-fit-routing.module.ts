import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { WelcomeNutriFitPage } from './welcome-nutri-fit.page';

const routes: Routes = [
  {
    path: '',
    component: WelcomeNutriFitPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WelcolmeNutriFitPageRoutingModule {}
