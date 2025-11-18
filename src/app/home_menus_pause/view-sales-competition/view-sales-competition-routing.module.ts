import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ViewSalesCompetitionPage } from './view-sales-competition.page';

const routes: Routes = [
  {
    path: '',
    component: ViewSalesCompetitionPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ViewSalesCompetitionPageRoutingModule {}
