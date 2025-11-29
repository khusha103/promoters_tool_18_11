import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LatestNewsPageRoutingModule } from './latest-news-routing.module';

import { LatestNewsPage } from './latest-news.page';
import { SharedModule } from 'src/app/modules/shared/shared.module';




@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LatestNewsPageRoutingModule,
    SharedModule
  ],
  declarations: [LatestNewsPage]
})
export class LatestNewsPageModule {}
