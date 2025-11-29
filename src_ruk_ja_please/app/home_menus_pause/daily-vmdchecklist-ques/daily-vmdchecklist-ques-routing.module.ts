import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DailyVmdchecklistQuesPage } from './daily-vmdchecklist-ques.page';

const routes: Routes = [
  {
    path: '',
    component: DailyVmdchecklistQuesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DailyVmdchecklistQuesPageRoutingModule {}
