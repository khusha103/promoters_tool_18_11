import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ServerDownPage } from './server-down.page';

const routes: Routes = [
  {
    path: '',
    component: ServerDownPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ServerDownPageRoutingModule {}
