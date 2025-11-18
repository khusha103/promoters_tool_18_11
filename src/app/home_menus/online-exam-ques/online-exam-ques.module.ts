import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OnlineExamQuesPageRoutingModule } from './online-exam-ques-routing.module';

import { OnlineExamQuesPage } from './online-exam-ques.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OnlineExamQuesPageRoutingModule
  ],
  declarations: [OnlineExamQuesPage]
})
export class OnlineExamQuesPageModule {}
