import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginNutrifitPage } from './login-nutrifit.page';

const routes: Routes = [
  {
    path: '',
    component: LoginNutrifitPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LoginNutrifitPageRoutingModule {}
