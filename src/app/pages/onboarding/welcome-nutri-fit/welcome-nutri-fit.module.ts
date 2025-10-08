import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { WelcolmeNutriFitPageRoutingModule } from './welcome-nutri-fit-routing.module';

import { WelcomeNutriFitPage } from '@/app/pages/onboarding/welcome-nutri-fit/welcome-nutri-fit.page';

import { ComponentsModule } from '@/app/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    WelcolmeNutriFitPageRoutingModule,
    ComponentsModule
  ],
  declarations: [WelcomeNutriFitPage]
})
export class WelcolmeNutriFitPageModule {}
