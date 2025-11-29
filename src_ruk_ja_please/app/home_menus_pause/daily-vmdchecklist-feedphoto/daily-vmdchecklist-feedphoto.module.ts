import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DailyVmdchecklistFeedphotoPageRoutingModule } from './daily-vmdchecklist-feedphoto-routing.module';

import { DailyVmdchecklistFeedphotoPage } from './daily-vmdchecklist-feedphoto.page';
import { SharedModule } from 'src/app/modules/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DailyVmdchecklistFeedphotoPageRoutingModule,
    SharedModule
  ],
  declarations: [DailyVmdchecklistFeedphotoPage]
})
export class DailyVmdchecklistFeedphotoPageModule {}
