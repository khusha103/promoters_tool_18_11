import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LatestNewsPage } from './latest-news.page';

const routes: Routes = [
  {
    path: '',
    component: LatestNewsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LatestNewsPageRoutingModule {}
