import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DropdownTestPage } from './dropdown-test.page';

const routes: Routes = [
  {
    path: '',
    component: DropdownTestPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DropdownTestPageRoutingModule {}
