import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PromoterKpiInnerPageRoutingModule } from './promoter-kpi-inner-routing.module';

import { PromoterKpiInnerPage } from './promoter-kpi-inner.page';
import { SharedModule } from 'src/app/modules/shared/shared.module';




@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PromoterKpiInnerPageRoutingModule,
    SharedModule
  ],
  declarations: [PromoterKpiInnerPage]
})
export class PromoterKpiInnerPageModule {}
