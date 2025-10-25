import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

import { PrimaryButtonComponent } from './primary-button/primary-button.component';
import { SecondaryButtonWithIconComponent } from './secondary-button-with-icon/secondary-button-with-icon.component';
import { PickerDateComponent } from './pickers/picker-date/picker-date.component';
import { PickerAlturaComponent } from './pickers/picker-altura/picker-altura.component';
import { PickerPesoComponent } from './pickers/picker-peso/picker-peso.component';
import { PickerGeneroComponent } from './pickers/picker-genero/picker-genero.component';
import { CardRutinComponent } from './card-rutin/card-rutin.component';
import { InputTextWithIconComponent } from './input-text-with-icon/input-text-with-icon.component';
import { PrimaryButtonWithIconComponent } from './primary-button-with-icon/primary-button-with-icon.component';
import { SearchComponent } from './search/search.component';
import { TabsComponent } from './tabs/tabs.component';
import { WelcomeHeaderComponentComponent } from './welcome-header-component/welcome-header-component.component';
import { SecondaryButtonComponent } from './secondary-button/secondary-button.component';
import { ObjectiveComponent } from './objective/objective.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    PrimaryButtonComponent,
    PrimaryButtonWithIconComponent,
    SecondaryButtonComponent,
    SecondaryButtonWithIconComponent,
    PickerDateComponent,
    PickerAlturaComponent,
    PickerPesoComponent,
    PickerGeneroComponent,
    SearchComponent,
    CardRutinComponent,
    InputTextWithIconComponent,
    TabsComponent,
    WelcomeHeaderComponentComponent,
    ObjectiveComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule
  ],
  exports: [
    PrimaryButtonComponent,
    SecondaryButtonComponent,
    PrimaryButtonWithIconComponent,
    SecondaryButtonWithIconComponent,
    PickerDateComponent,
    PickerAlturaComponent,
    PickerPesoComponent,
    PickerGeneroComponent,
    SearchComponent,
    CardRutinComponent,
    InputTextWithIconComponent,
    TabsComponent,
    WelcomeHeaderComponentComponent,
    ObjectiveComponent
  ]
})
export class ComponentsModule {}