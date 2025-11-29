import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OnlineWebniarScreenPage } from './online-webniar-screen.page';

const routes: Routes = [
  {
    path: '',
    component: OnlineWebniarScreenPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OnlineWebniarScreenPageRoutingModule {}
