import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PromotersAssessmentQuesPageRoutingModule } from './promoters-assessment-ques-routing.module';

import { PromotersAssessmentQuesPage } from './promoters-assessment-ques.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PromotersAssessmentQuesPageRoutingModule
  ],
  declarations: [PromotersAssessmentQuesPage]
})
export class PromotersAssessmentQuesPageModule {}
