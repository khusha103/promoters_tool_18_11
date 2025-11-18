import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PlanogramFeedbackPageRoutingModule } from './planogram-feedback-routing.module';

import { PlanogramFeedbackPage } from './planogram-feedback.page';
import { SharedModule } from 'src/app/modules/shared/shared.module';




@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PlanogramFeedbackPageRoutingModule,
    SharedModule
  ],
  declarations: [PlanogramFeedbackPage]
})
export class PlanogramFeedbackPageModule {}
