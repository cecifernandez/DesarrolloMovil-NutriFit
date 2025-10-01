import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FitnessPage } from './fitness.page';

const routes: Routes = [
  {
    path: '',
    component: FitnessPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FitnessPageRoutingModule {}
