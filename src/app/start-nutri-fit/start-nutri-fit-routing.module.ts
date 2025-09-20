import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StartNutriFitPage } from './start-nutri-fit.page';

const routes: Routes = [
  {
    path: '',
    component: StartNutriFitPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StartNutriFitPageRoutingModule {}
