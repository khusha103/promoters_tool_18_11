import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DailySalesPage } from './daily-sales.page';

const routes: Routes = [
  {
    path: '',
    component: DailySalesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DailySalesPageRoutingModule {}
