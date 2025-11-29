import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PlanogramFeedbackFormPageRoutingModule } from './planogram-feedback-form-routing.module';

import { PlanogramFeedbackFormPage } from './planogram-feedback-form.page';
import { SharedModule } from 'src/app/modules/shared/shared.module';




@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PlanogramFeedbackFormPageRoutingModule,
    SharedModule
  ],
  declarations: [PlanogramFeedbackFormPage]
})
export class PlanogramFeedbackFormPageModule {}
