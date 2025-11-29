import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OnlineWebniarPage } from './online-webniar.page';

const routes: Routes = [
  {
    path: '',
    component: OnlineWebniarPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OnlineWebniarPageRoutingModule {}
