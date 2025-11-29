import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CustomerInformationPage } from './customer-information.page';

const routes: Routes = [
  {
    path: '',
    component: CustomerInformationPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CustomerInformationPageRoutingModule {}
