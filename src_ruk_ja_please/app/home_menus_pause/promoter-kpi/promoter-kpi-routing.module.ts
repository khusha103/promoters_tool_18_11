import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PromoterKpiPage } from './promoter-kpi.page';

const routes: Routes = [
  {
    path: '',
    component: PromoterKpiPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PromoterKpiPageRoutingModule {}
