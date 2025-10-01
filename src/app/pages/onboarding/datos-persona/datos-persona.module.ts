import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { DatosPersonaPageRoutingModule } from './datos-persona-routing.module';
import { DatosPersonaPage } from './datos-persona.page';
import { ComponentsModule } from '@/app/components/components.module';




@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DatosPersonaPageRoutingModule,
    ComponentsModule
     
  ],
  declarations: [
    DatosPersonaPage,
   
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA], 
})
export class DatosPersonaPageModule {}
