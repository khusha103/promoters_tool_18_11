import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RegisterNewStorePage } from './register-new-store.page';

const routes: Routes = [
  {
    path: '',
    component: RegisterNewStorePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RegisterNewStorePageRoutingModule {}
