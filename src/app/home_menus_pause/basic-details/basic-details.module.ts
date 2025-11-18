import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BasicDetailsPageRoutingModule } from './basic-details-routing.module';

import { BasicDetailsPage } from './basic-details.page';
import { SharedModule } from 'src/app/modules/shared/shared.module';
// import { SharedModule } from '../shared/shared.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BasicDetailsPageRoutingModule,
    SharedModule
  ],
  declarations: [BasicDetailsPage]
})
export class BasicDetailsPageModule {}
