import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OnlineExamCategoryPage } from './online-exam-category.page';

const routes: Routes = [
  {
    path: '',
    component: OnlineExamCategoryPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OnlineExamCategoryPageRoutingModule {}
