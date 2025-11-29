import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UploadCompetitorSalesPage } from './upload-competitor-sales.page';

const routes: Routes = [
  {
    path: '',
    component: UploadCompetitorSalesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UploadCompetitorSalesPageRoutingModule {}
