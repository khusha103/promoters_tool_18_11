import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OnlineWebniarListPage } from './online-webniar-list.page';

const routes: Routes = [
  {
    path: '',
    component: OnlineWebniarListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OnlineWebniarListPageRoutingModule {}
