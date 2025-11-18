import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PromotersAssessmentQuesPage } from './promoters-assessment-ques.page';

const routes: Routes = [
  {
    path: '',
    component: PromotersAssessmentQuesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PromotersAssessmentQuesPageRoutingModule {}
