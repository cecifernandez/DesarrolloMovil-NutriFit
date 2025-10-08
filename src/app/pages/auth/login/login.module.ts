import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { LogInPageRoutingModule } from './login-routing.module';
import { LogInPage } from './login.page';

import { ComponentsModule } from '@/app/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LogInPageRoutingModule,
    ComponentsModule,
  ],
  declarations: [LogInPage]
})
export class LogInPageModule {}