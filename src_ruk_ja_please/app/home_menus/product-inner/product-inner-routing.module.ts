import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProductInnerPage } from './product-inner.page';

const routes: Routes = [
  {
    path: '',
    component: ProductInnerPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProductInnerPageRoutingModule {}
