import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ServerDownPageRoutingModule } from './server-down-routing.module';

import { ServerDownPage } from './server-down.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ServerDownPageRoutingModule
  ],
  declarations: [ServerDownPage]
})
export class ServerDownPageModule {}
