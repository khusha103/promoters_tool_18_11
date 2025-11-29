import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProductSalestalkPageRoutingModule } from './product-salestalk-routing.module';

import { ProductSalestalkPage } from './product-salestalk.page';
import { SharedModule } from 'src/app/modules/shared/shared.module';
// import { SharedModule } from '../shared/shared.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProductSalestalkPageRoutingModule,
    SharedModule

  ],
  declarations: [ProductSalestalkPage]
})
export class ProductSalestalkPageModule {}
