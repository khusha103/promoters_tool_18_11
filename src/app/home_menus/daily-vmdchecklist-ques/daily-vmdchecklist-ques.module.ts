import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { DailyVmdchecklistQuesPage } from './daily-vmdchecklist-ques.page';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,    // <- required for [(ngModel)]
    IonicModule,
    RouterModule.forChild([{ path: '', component: DailyVmdchecklistQuesPage }])
  ],
  declarations: [DailyVmdchecklistQuesPage],
  // optional: if the compiler still complains about unknown web-component details,
  // you may add CUSTOM_ELEMENTS_SCHEMA — but this is rarely required in Ionic projects
  // (IonicModule + proper imports usually suffice).
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class DailyVmdchecklistQuesPageModule {}
