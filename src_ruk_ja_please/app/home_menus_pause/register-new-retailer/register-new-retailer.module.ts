import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RegisterNewRetailerPageRoutingModule } from './register-new-retailer-routing.module';

import { RegisterNewRetailerPage } from './register-new-retailer.page';
import { SharedModule } from 'src/app/modules/shared/shared.module';




@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RegisterNewRetailerPageRoutingModule,
    SharedModule
  ],
  declarations: [RegisterNewRetailerPage]
})
export class RegisterNewRetailerPageModule {}
