import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CustomerInformationPageRoutingModule } from './customer-information-routing.module';

import { CustomerInformationPage } from './customer-information.page';
import { SharedModule } from 'src/app/modules/shared/shared.module';




@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CustomerInformationPageRoutingModule,
    SharedModule
  ],
  declarations: [CustomerInformationPage]
})
export class CustomerInformationPageModule {}
