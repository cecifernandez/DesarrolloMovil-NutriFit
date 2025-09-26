import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FitnessPageRoutingModule } from './fitness-routing.module';

import { FitnessPage } from './fitness.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FitnessPageRoutingModule
  ],
  declarations: [FitnessPage]
})
export class FitnessPageModule {}
