import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OnlineExamDetailsPage } from './online-exam-details.page';

const routes: Routes = [
  {
    path: '',
    component: OnlineExamDetailsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OnlineExamDetailsPageRoutingModule {}
