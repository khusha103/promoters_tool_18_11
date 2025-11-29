import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DisplayGuidelinesPage } from './display-guidelines.page';

const routes: Routes = [
  {
    path: '',
    component: DisplayGuidelinesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DisplayGuidelinesPageRoutingModule {}
