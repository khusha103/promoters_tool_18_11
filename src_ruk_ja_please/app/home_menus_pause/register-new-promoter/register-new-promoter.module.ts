import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RegisterNewPromoterPageRoutingModule } from './register-new-promoter-routing.module';

import { RegisterNewPromoterPage } from './register-new-promoter.page';
import { SharedModule } from 'src/app/modules/shared/shared.module';



@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RegisterNewPromoterPageRoutingModule,
    SharedModule
  ],
  declarations: [RegisterNewPromoterPage]
})
export class RegisterNewPromoterPageModule {}
