import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UploadYourSalesPage } from './upload-your-sales.page';

const routes: Routes = [
  {
    path: '',
    component: UploadYourSalesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UploadYourSalesPageRoutingModule {}
