import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UploadYourSalesPageRoutingModule } from './upload-your-sales-routing.module';

import { UploadYourSalesPage } from './upload-your-sales.page';
import { SharedModule } from 'src/app/modules/shared/shared.module';

// import { SharedModule } from '../shared/shared.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UploadYourSalesPageRoutingModule,
    SharedModule
  ],
  declarations: [UploadYourSalesPage]
})
export class UploadYourSalesPageModule {}
