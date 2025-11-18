import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BasicDetailsPage } from './basic-details.page';

const routes: Routes = [
  {
    path: '',
    component: BasicDetailsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BasicDetailsPageRoutingModule {}
