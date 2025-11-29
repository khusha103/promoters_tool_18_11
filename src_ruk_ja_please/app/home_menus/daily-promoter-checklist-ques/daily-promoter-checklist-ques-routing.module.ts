import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DailyPromoterChecklistQuesPage } from './daily-promoter-checklist-ques.page';

const routes: Routes = [
  {
    path: '',
    component: DailyPromoterChecklistQuesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DailyPromoterChecklistQuesPageRoutingModule {}
