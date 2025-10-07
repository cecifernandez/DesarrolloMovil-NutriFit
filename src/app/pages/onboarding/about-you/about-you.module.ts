import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { AboutYouPageRoutingModule } from './about-you-routing.module';
import { AboutYouPage } from './about-you.page';
import { ComponentsModule } from '@/app/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AboutYouPageRoutingModule,
    ComponentsModule
  ],
  declarations: [
    AboutYouPage,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA], 
})
export class AboutYouModule {}
