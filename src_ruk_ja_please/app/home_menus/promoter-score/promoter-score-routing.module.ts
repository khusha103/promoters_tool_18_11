import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PromoterScorePage } from './promoter-score.page';

const routes: Routes = [
  {
    path: '',
    component: PromoterScorePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PromoterScorePageRoutingModule {}
