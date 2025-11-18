import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DailyVmdchecklistQuesPageRoutingModule } from './daily-vmdchecklist-ques-routing.module';

import { DailyVmdchecklistQuesPage } from './daily-vmdchecklist-ques.page';
import { SharedModule } from 'src/app/modules/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DailyVmdchecklistQuesPageRoutingModule,
    SharedModule
  ],
  declarations: [DailyVmdchecklistQuesPage]
})
export class DailyVmdchecklistQuesPageModule {}
