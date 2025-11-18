import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RegisterNewStorePageRoutingModule } from './register-new-store-routing.module';

import { RegisterNewStorePage } from './register-new-store.page';
import { SharedModule } from 'src/app/modules/shared/shared.module';



@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RegisterNewStorePageRoutingModule,
    SharedModule
  ],
  declarations: [RegisterNewStorePage]
})
export class RegisterNewStorePageModule {}
