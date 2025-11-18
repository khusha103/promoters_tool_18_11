import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UpdateRangingFeedbackPage } from './update-ranging-feedback.page';

const routes: Routes = [
  {
    path: '',
    component: UpdateRangingFeedbackPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UpdateRangingFeedbackPageRoutingModule {}
