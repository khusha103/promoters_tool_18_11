import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OnlineWebniarScreenPageRoutingModule } from './online-webniar-screen-routing.module';

import { OnlineWebniarScreenPage } from './online-webniar-screen.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OnlineWebniarScreenPageRoutingModule
  ],
  declarations: [OnlineWebniarScreenPage]
})
export class OnlineWebniarScreenPageModule {}
