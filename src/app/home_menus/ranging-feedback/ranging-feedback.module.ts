import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RangingFeedbackPageRoutingModule } from './ranging-feedback-routing.module';

import { RangingFeedbackPage } from './ranging-feedback.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RangingFeedbackPageRoutingModule
  ],
  declarations: [RangingFeedbackPage]
})
export class RangingFeedbackPageModule {}
