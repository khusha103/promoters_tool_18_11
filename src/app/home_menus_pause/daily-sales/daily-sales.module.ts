import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DailySalesPageRoutingModule } from './daily-sales-routing.module';

import { DailySalesPage } from './daily-sales.page';
import { SharedModule } from 'src/app/modules/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DailySalesPageRoutingModule,
    SharedModule
  ],
  declarations: [DailySalesPage]
})
export class DailySalesPageModule {}
