import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CreateAccPage } from './create-acc.page';

const routes: Routes = [
  {
    path: '',
    component: CreateAccPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CreateAccPageRoutingModule {}
