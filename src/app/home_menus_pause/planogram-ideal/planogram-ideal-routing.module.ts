import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PlanogramIdealPage } from './planogram-ideal.page';

const routes: Routes = [
  {
    path: '',
    component: PlanogramIdealPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PlanogramIdealPageRoutingModule {}
