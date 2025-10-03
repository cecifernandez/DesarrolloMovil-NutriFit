import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { WelcolmeNutriFitPageRoutingModule } from './welcome-nutri-fit-routing.module';

import { WelcomeNutriFitPage } from '../../onboarding/welcome-nutri-fit/welcome-nutri-fit.page';

import { PrimaryButtonComponent } from '../../../components/primary-button/primary-button.component';
import { SecondaryButtonComponent } from '../../../components/secondary-button/secondary-button.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    WelcolmeNutriFitPageRoutingModule,
  ],
  declarations: [WelcomeNutriFitPage, PrimaryButtonComponent, SecondaryButtonComponent]
})
export class WelcolmeNutriFitPageModule {}
