import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DailyVmdChecklistPageRoutingModule } from './daily-vmd-checklist-routing.module';

import { DailyVmdChecklistPage } from './daily-vmd-checklist.page';
import { SharedModule } from 'src/app/modules/shared/shared.module';



@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DailyVmdChecklistPageRoutingModule,
    SharedModule
  ],
  declarations: [DailyVmdChecklistPage]
})
export class DailyVmdChecklistPageModule {}
