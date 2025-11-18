import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PlanogramAreaPage } from './planogram-area.page';

const routes: Routes = [
  {
    path: '',
    component: PlanogramAreaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PlanogramAreaPageRoutingModule {}
