import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PlanogramFeedbackPage } from './planogram-feedback.page';

const routes: Routes = [
  {
    path: '',
    component: PlanogramFeedbackPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PlanogramFeedbackPageRoutingModule {}
