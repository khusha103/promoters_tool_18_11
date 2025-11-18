import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PromoterKpiPageRoutingModule } from './promoter-kpi-routing.module';

import { PromoterKpiPage } from './promoter-kpi.page';
import { SharedModule } from 'src/app/modules/shared/shared.module';




@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PromoterKpiPageRoutingModule,
    SharedModule
  ],
  declarations: [PromoterKpiPage]
})
export class PromoterKpiPageModule {}
