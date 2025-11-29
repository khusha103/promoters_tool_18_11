import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ViewSalesSonyPageRoutingModule } from './view-sales-sony-routing.module';

import { ViewSalesSonyPage } from './view-sales-sony.page';
import { SharedModule } from 'src/app/modules/shared/shared.module';

// import { SharedModule } from '../shared/shared.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ViewSalesSonyPageRoutingModule,
    SharedModule
  ],
  declarations: [ViewSalesSonyPage]
})
export class ViewSalesSonyPageModule {}
