import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';

import { IonicModule } from '@ionic/angular';

import { CreateAccPageRoutingModule } from './create-acc-routing.module';

import { CreateAccPage } from './create-acc.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CreateAccPageRoutingModule,
    ExploreContainerComponentModule
  ],
  declarations: [CreateAccPage]
})
export class CreateAccPageModule {}
