import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { DatosPersonaPageRoutingModule } from './datos-persona-routing.module';
import { DatosPersonaPage } from './datos-persona.page';
import { PickerGeneroComponent } from '../components/pickers/picker-genero/picker-genero.component';
import { PickerPesoComponent } from '../components/pickers/picker-peso/picker-peso.component';
import { PickerAlturaComponent } from '../components/pickers/picker-altura/picker-altura.component';
import { PickerDateComponent } from '../components/pickers/picker-date/picker-date.component';

import { PrimaryButtonComponent } from '../components/primary-button/primary-button.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DatosPersonaPageRoutingModule,
  ],
  declarations: [
    DatosPersonaPage,
    PickerGeneroComponent,
    PickerPesoComponent, 
    PickerAlturaComponent,
    PickerDateComponent,
    PrimaryButtonComponent,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA], 
})
export class DatosPersonaPageModule {}
