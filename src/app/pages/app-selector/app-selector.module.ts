import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AppSelectorPageRoutingModule } from './app-selector-routing.module';

import { AppSelectorPage } from './app-selector.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AppSelectorPageRoutingModule
  ],
  declarations: [AppSelectorPage]
})
export class AppSelectorPageModule {}
