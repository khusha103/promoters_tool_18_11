// import { NgModule } from '@angular/core';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HomePageRoutingModule } from './home-routing.module';

import { HomePage } from './home.page';
import { SharedModule } from '../modules/shared/shared.module';
// import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';
// import { SharedModule } from '../shared/shared.module';



// import { FooterPageModule } from '../footer/footer.module';
// import { FooterPage } from '../footer/footer.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    // ExploreContainerComponentModule,   
    HomePageRoutingModule,
    SharedModule,
    
    // SharedModule

  ],
  declarations: [HomePage],
    // declarations: [HomePage],

  schemas: [CUSTOM_ELEMENTS_SCHEMA]
  
})
export class HomePageModule {}
