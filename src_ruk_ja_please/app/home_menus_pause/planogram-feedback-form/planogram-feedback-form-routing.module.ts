import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PlanogramFeedbackFormPage } from './planogram-feedback-form.page';

const routes: Routes = [
  {
    path: '',
    component: PlanogramFeedbackFormPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PlanogramFeedbackFormPageRoutingModule {}
