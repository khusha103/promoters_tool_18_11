import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AppSelectorPage } from './app-selector.page';

const routes: Routes = [
  {
    path: '',
    component: AppSelectorPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AppSelectorPageRoutingModule {}
