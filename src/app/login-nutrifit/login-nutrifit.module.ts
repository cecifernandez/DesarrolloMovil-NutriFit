import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


import { IonicModule } from '@ionic/angular';

import { LoginNutrifitPageRoutingModule } from './login-nutrifit-routing.module';

import { LoginNutrifitPage } from './login-nutrifit.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LoginNutrifitPageRoutingModule
  ],
  declarations: [LoginNutrifitPage]
})
export class LoginNutrifitPageModule {}
