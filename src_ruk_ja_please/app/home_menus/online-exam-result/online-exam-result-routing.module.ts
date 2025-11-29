import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OnlineExamResultPage } from './online-exam-result.page';

const routes: Routes = [
  {
    path: '',
    component: OnlineExamResultPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OnlineExamResultPageRoutingModule {}
