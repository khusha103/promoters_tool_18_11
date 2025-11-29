import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { IncentivesCalculatorPage } from './incentives-calculator.page';

const routes: Routes = [
  {
    path: '',
    component: IncentivesCalculatorPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class IncentivesCalculatorPageRoutingModule {}
