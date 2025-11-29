import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OnlineExamCategoryPageRoutingModule } from './online-exam-category-routing.module';

import { OnlineExamCategoryPage } from './online-exam-category.page';
import { SharedModule } from 'src/app/modules/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OnlineExamCategoryPageRoutingModule,
    SharedModule
  ],
  declarations: [OnlineExamCategoryPage]
})
export class OnlineExamCategoryPageModule {}
