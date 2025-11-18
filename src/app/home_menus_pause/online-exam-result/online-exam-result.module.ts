import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OnlineExamResultPageRoutingModule } from './online-exam-result-routing.module';

import { OnlineExamResultPage } from './online-exam-result.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OnlineExamResultPageRoutingModule
  ],
  declarations: [OnlineExamResultPage]
})
export class OnlineExamResultPageModule {}
