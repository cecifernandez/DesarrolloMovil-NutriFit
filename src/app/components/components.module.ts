
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';



import { PrimaryButtonComponent } from './primary-button/primary-button.component';
import { SecondaryButtonComponent } from './secondary-button/secondary-button.component';
import { PickerDateComponent } from './pickers/picker-date/picker-date.component';
import { PickerAlturaComponent } from './pickers/picker-altura/picker-altura.component';
import { PickerPesoComponent } from './pickers/picker-peso/picker-peso.component';
import { PickerGeneroComponent } from './pickers/picker-genero/picker-genero.component';

@NgModule({
  declarations: [
    PrimaryButtonComponent,
    SecondaryButtonComponent,
    PickerDateComponent,
    PickerAlturaComponent,
    PickerPesoComponent,
    PickerGeneroComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
  ],
  exports: [
    PrimaryButtonComponent,
    SecondaryButtonComponent,
    PickerDateComponent,
    PickerAlturaComponent,
    PickerPesoComponent,
    PickerGeneroComponent
  ]
})
export class ComponentsModule {}