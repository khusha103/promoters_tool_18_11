import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ViewSalesCompetitionPageRoutingModule } from './view-sales-competition-routing.module';

import { ViewSalesCompetitionPage } from './view-sales-competition.page';
import { SharedModule } from 'src/app/modules/shared/shared.module';

// import { SharedModule } from '../shared/shared.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ViewSalesCompetitionPageRoutingModule,
   SharedModule
  ],
  declarations: [ViewSalesCompetitionPage]
})
export class ViewSalesCompetitionPageModule {}
