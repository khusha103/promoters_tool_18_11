import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ServiceRelatedPage } from './service-related.page';

const routes: Routes = [
  {
    path: '',
    component: ServiceRelatedPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ServiceRelatedPageRoutingModule {}
