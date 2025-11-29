import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UpdateRangingFeedbackPageRoutingModule } from './update-ranging-feedback-routing.module';

import { UpdateRangingFeedbackPage } from './update-ranging-feedback.page';
import { SharedModule } from 'src/app/modules/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UpdateRangingFeedbackPageRoutingModule,
    SharedModule
  ],
  declarations: [UpdateRangingFeedbackPage]
})
export class UpdateRangingFeedbackPageModule {}
