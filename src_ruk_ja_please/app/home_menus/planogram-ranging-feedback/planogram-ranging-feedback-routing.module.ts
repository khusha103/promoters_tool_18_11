import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PlanogramRangingFeedbackPage } from './planogram-ranging-feedback.page';

const routes: Routes = [
  {
    path: '',
    component: PlanogramRangingFeedbackPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PlanogramRangingFeedbackPageRoutingModule {}
