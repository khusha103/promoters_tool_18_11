import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DailyVmdChecklistPage } from './daily-vmd-checklist.page';

const routes: Routes = [
  {
    path: '',
    component: DailyVmdChecklistPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DailyVmdChecklistPageRoutingModule {}
