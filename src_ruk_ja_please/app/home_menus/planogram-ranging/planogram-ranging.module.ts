import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PlanogramRangingPageRoutingModule } from './planogram-ranging-routing.module';

import { PlanogramRangingPage } from './planogram-ranging.page';
import { SharedModule } from 'src/app/modules/shared/shared.module';




@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PlanogramRangingPageRoutingModule,
    SharedModule
  ],
  declarations: [PlanogramRangingPage]
})
export class PlanogramRangingPageModule {}
