import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PromotersAssessmentPage } from './promoters-assessment.page';

const routes: Routes = [
  {
    path: '',
    component: PromotersAssessmentPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PromotersAssessmentPageRoutingModule {}
