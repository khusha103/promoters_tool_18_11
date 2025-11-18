import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PromoterScorePageRoutingModule } from './promoter-score-routing.module';

import { PromoterScorePage } from './promoter-score.page';
import { SharedModule } from 'src/app/modules/shared/shared.module';
import { NgxPaginationModule } from 'ngx-pagination';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PromoterScorePageRoutingModule,
    SharedModule,
    NgxPaginationModule
  ],
  declarations: [PromoterScorePage]
})
export class PromoterScorePageModule {}
