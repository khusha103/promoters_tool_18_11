import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RangingFeedbackPage } from './ranging-feedback.page';

const routes: Routes = [
  {
    path: '',
    component: RangingFeedbackPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RangingFeedbackPageRoutingModule {}
