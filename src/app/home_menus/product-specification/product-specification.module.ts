import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProductSpecificationPageRoutingModule } from './product-specification-routing.module';

import { ProductSpecificationPage } from './product-specification.page';
import { SharedModule } from 'src/app/modules/shared/shared.module';
// import { FooterComponentComponent } from '../MyComponents/footer-component/footer-component.component';
// import { SharedModule } from '../shared/shared.module';



@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProductSpecificationPageRoutingModule,
   SharedModule
  ],
  declarations: [ProductSpecificationPage]
})
export class ProductSpecificationPageModule {}
