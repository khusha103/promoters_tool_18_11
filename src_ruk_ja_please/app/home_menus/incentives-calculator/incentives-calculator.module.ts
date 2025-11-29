import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { IncentivesCalculatorPageRoutingModule } from './incentives-calculator-routing.module';

import { IncentivesCalculatorPage } from './incentives-calculator.page';
import { SharedModule } from 'src/app/modules/shared/shared.module';

// import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    IncentivesCalculatorPageRoutingModule,
    SharedModule
  ],
  declarations: [IncentivesCalculatorPage]
})
export class IncentivesCalculatorPageModule {}
