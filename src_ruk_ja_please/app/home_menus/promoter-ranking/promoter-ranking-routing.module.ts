import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PromoterRankingPage } from './promoter-ranking.page';

const routes: Routes = [
  {
    path: '',
    component: PromoterRankingPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PromoterRankingPageRoutingModule {}
