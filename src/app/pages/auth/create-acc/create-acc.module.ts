import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
//import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CreateAccPageRoutingModule } from './create-acc-routing.module';

import { InputTextComponent } from '../../../components/input-text/input-text.component';

import { CreateAccPage } from './create-acc.page';

@NgModule({
  imports: [
    CommonModule,
    //FormsModule,
    IonicModule,
    CreateAccPageRoutingModule
  ],
  declarations: [CreateAccPage, InputTextComponent]
})
export class CreateAccPageModule {}
