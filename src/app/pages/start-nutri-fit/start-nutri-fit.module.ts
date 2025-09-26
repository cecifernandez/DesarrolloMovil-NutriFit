import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { StartNutriFitPageRoutingModule } from './start-nutri-fit-routing.module';

import { StartNutriFitPage } from './start-nutri-fit.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    StartNutriFitPageRoutingModule
  ],
  declarations: [StartNutriFitPage]
})
export class StartNutriFitPageModule {}
