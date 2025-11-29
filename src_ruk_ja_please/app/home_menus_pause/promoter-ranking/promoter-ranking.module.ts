import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PromoterRankingPageRoutingModule } from './promoter-ranking-routing.module';

import { PromoterRankingPage } from './promoter-ranking.page';
import { SharedModule } from 'src/app/modules/shared/shared.module';

// import { SharedModule } from '../shared/shared.module';
import { NgxPaginationModule } from 'ngx-pagination';



@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PromoterRankingPageRoutingModule,
    SharedModule,
    NgxPaginationModule
    

  ],
  declarations: [PromoterRankingPage]
})
export class PromoterRankingPageModule {}
