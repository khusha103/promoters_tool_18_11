import { CUSTOM_ELEMENTS_SCHEMA,NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProductInnerPageRoutingModule } from './product-inner-routing.module';

import { ProductInnerPage } from './product-inner.page';
import { SharedModule } from 'src/app/modules/shared/shared.module';





@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProductInnerPageRoutingModule,
    SharedModule
    
  ],
  declarations: [ProductInnerPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ProductInnerPageModule {}
