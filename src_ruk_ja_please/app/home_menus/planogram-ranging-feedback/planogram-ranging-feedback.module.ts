import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PlanogramRangingFeedbackPageRoutingModule } from './planogram-ranging-feedback-routing.module';

import { PlanogramRangingFeedbackPage } from './planogram-ranging-feedback.page';
import { SharedModule } from 'src/app/modules/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PlanogramRangingFeedbackPageRoutingModule,
    SharedModule
  ],
  declarations: [PlanogramRangingFeedbackPage]
})
export class PlanogramRangingFeedbackPageModule {}
