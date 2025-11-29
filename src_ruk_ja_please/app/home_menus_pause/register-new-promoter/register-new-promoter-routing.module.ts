import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RegisterNewPromoterPage } from './register-new-promoter.page';

const routes: Routes = [
  {
    path: '',
    component: RegisterNewPromoterPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RegisterNewPromoterPageRoutingModule {}
