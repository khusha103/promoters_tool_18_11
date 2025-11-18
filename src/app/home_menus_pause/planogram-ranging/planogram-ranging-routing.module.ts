import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PlanogramRangingPage } from './planogram-ranging.page';

const routes: Routes = [
  {
    path: '',
    component: PlanogramRangingPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PlanogramRangingPageRoutingModule {}
