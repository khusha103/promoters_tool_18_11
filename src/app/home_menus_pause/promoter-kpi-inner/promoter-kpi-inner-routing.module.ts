import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PromoterKpiInnerPage } from './promoter-kpi-inner.page';

const routes: Routes = [
  {
    path: '',
    component: PromoterKpiInnerPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PromoterKpiInnerPageRoutingModule {}
