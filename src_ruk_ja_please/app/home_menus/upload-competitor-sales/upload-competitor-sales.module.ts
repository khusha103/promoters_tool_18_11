import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UploadCompetitorSalesPageRoutingModule } from './upload-competitor-sales-routing.module';

import { UploadCompetitorSalesPage } from './upload-competitor-sales.page';
import { SharedModule } from 'src/app/modules/shared/shared.module';

// import { SharedModule } from '../shared/shared.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UploadCompetitorSalesPageRoutingModule,
   SharedModule
  ],
  declarations: [UploadCompetitorSalesPage]
})
export class UploadCompetitorSalesPageModule {}
