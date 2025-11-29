import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OnlineWebniarPageRoutingModule } from './online-webniar-routing.module';

import { OnlineWebniarPage } from './online-webniar.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OnlineWebniarPageRoutingModule
  ],
  declarations: [OnlineWebniarPage]
})
export class OnlineWebniarPageModule {}
