import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ServiceRelatedPageRoutingModule } from './service-related-routing.module';

import { ServiceRelatedPage } from './service-related.page';
import { SharedModule } from 'src/app/modules/shared/shared.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ServiceRelatedPageRoutingModule,
    SharedModule
  ],
  declarations: [ServiceRelatedPage]
})
export class ServiceRelatedPageModule {}
