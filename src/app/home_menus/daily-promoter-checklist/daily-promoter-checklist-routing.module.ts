import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DailyPromoterChecklistPage } from './daily-promoter-checklist.page';

const routes: Routes = [
  {
    path: '',
    component: DailyPromoterChecklistPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DailyPromoterChecklistPageRoutingModule {}
