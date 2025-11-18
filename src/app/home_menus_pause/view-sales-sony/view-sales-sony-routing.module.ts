import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ViewSalesSonyPage } from './view-sales-sony.page';

const routes: Routes = [
  {
    path: '',
    component: ViewSalesSonyPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ViewSalesSonyPageRoutingModule {}
