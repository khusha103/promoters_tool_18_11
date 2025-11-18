import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProductCountertalkPage } from './product-countertalk.page';

const routes: Routes = [
  {
    path: '',
    component: ProductCountertalkPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProductCountertalkPageRoutingModule {}
