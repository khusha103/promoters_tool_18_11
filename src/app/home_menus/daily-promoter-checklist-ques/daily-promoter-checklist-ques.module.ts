import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { DailyPromoterChecklistQuesPageRoutingModule } from './daily-promoter-checklist-ques-routing.module';
import { DailyPromoterChecklistQuesPage } from './daily-promoter-checklist-ques.page';
import { SharedModule } from 'src/app/modules/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DailyPromoterChecklistQuesPageRoutingModule,
    SharedModule
  ],
  declarations: [DailyPromoterChecklistQuesPage]
})
export class DailyPromoterChecklistQuesPageModule {}
