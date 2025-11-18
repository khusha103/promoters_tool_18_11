import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OnlineWebniarListPageRoutingModule } from './online-webniar-list-routing.module';

import { OnlineWebniarListPage } from './online-webniar-list.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OnlineWebniarListPageRoutingModule
  ],
  declarations: [OnlineWebniarListPage]
})
export class OnlineWebniarListPageModule {}
