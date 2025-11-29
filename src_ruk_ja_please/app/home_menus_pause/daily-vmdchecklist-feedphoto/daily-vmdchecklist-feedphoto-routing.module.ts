import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DailyVmdchecklistFeedphotoPage } from './daily-vmdchecklist-feedphoto.page';

const routes: Routes = [
  {
    path: '',
    component: DailyVmdchecklistFeedphotoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DailyVmdchecklistFeedphotoPageRoutingModule {}
