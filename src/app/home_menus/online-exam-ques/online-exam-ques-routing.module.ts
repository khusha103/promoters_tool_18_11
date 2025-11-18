import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OnlineExamQuesPage } from './online-exam-ques.page';

const routes: Routes = [
  {
    path: '',
    component: OnlineExamQuesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OnlineExamQuesPageRoutingModule {}
