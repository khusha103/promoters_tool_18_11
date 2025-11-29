import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DropdownTestPageRoutingModule } from './dropdown-test-routing.module';

import { DropdownTestPage } from './dropdown-test.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DropdownTestPageRoutingModule
  ],
  declarations: [DropdownTestPage]
})
export class DropdownTestPageModule {}
