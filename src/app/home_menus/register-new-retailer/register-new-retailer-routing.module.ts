import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RegisterNewRetailerPage } from './register-new-retailer.page';

const routes: Routes = [
  {
    path: '',
    component: RegisterNewRetailerPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RegisterNewRetailerPageRoutingModule {}
