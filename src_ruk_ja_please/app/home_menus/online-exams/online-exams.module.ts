import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OnlineExamsPageRoutingModule } from './online-exams-routing.module';

import { OnlineExamsPage } from './online-exams.page';
import { SharedModule } from 'src/app/modules/shared/shared.module';




@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OnlineExamsPageRoutingModule,
    SharedModule
  ],
  declarations: [OnlineExamsPage]
})
export class OnlineExamsPageModule {}
