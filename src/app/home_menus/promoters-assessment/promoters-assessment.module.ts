import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PromotersAssessmentPageRoutingModule } from './promoters-assessment-routing.module';

import { PromotersAssessmentPage } from './promoters-assessment.page';
import { SharedModule } from 'src/app/modules/shared/shared.module';




@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PromotersAssessmentPageRoutingModule,
    SharedModule
  ],
  declarations: [PromotersAssessmentPage]
})
export class PromotersAssessmentPageModule {}
