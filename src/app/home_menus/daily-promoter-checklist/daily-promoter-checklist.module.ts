import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { DailyPromoterChecklistPageRoutingModule } from './daily-promoter-checklist-routing.module';
import { DailyPromoterChecklistPage } from './daily-promoter-checklist.page';
import { SharedModule } from 'src/app/modules/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DailyPromoterChecklistPageRoutingModule,
    SharedModule
  ],
  declarations: [DailyPromoterChecklistPage]
})
export class DailyPromoterChecklistPageModule {}
