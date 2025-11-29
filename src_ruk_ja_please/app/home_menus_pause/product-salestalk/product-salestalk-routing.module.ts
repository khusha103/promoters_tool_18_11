import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProductSalestalkPage } from './product-salestalk.page';

const routes: Routes = [
  {
    path: '',
    component: ProductSalestalkPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProductSalestalkPageRoutingModule {}
