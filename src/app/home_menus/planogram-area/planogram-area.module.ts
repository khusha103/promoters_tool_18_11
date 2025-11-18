import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PlanogramAreaPageRoutingModule } from './planogram-area-routing.module';

import { PlanogramAreaPage } from './planogram-area.page';
import { SharedModule } from 'src/app/modules/shared/shared.module';




@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PlanogramAreaPageRoutingModule,
    SharedModule,
  
  ],
  declarations: [PlanogramAreaPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class PlanogramAreaPageModule {}
