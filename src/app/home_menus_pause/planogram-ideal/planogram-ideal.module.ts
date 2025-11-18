import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PlanogramIdealPageRoutingModule } from './planogram-ideal-routing.module';

import { PlanogramIdealPage } from './planogram-ideal.page';
import { SharedModule } from 'src/app/modules/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PlanogramIdealPageRoutingModule,
    SharedModule
  ],
  declarations: [PlanogramIdealPage]
})
export class PlanogramIdealPageModule {}
