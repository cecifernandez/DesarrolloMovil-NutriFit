import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { WelcolmeNutriFitPageRoutingModule } from './welcolme-nutri-fit-routing.module';

import { WelcolmeNutriFitPage } from './welcolme-nutri-fit.page';

import { PrimaryButtonComponent } from '../components/primary-button/primary-button.component';
import { SecondaryButtonComponent } from '../components/secondary-button/secondary-button.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    WelcolmeNutriFitPageRoutingModule,
  ],
  declarations: [WelcolmeNutriFitPage, PrimaryButtonComponent, SecondaryButtonComponent]
})
export class WelcolmeNutriFitPageModule {}
