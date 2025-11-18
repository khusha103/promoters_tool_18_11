import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OnlineExamsPage } from './online-exams.page';

const routes: Routes = [
  {
    path: '',
    component: OnlineExamsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OnlineExamsPageRoutingModule {}
