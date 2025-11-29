import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FooterComponent } from 'src/app/components/footer/footer.component';
import { IonicModule } from '@ionic/angular';
import { CustomDropdownComponent } from 'src/app/components/custom-dropdown/custom-dropdown.component';
import { CustomModalComponent } from 'src/app/components/custom-modal/custom-modal.component';
import { SearchDropdownComponent } from 'src/app/components/search-dropdown/search-dropdown.component';
import { SearchDropdownmodalComponent } from 'src/app/components/search-dropdownmodal/search-dropdownmodal.component';
import { CustomProductDropdownComponent } from 'src/app/components/custom-product-dropdown/custom-product-dropdown.component';
import { CustomProductModalComponent } from 'src/app/components/custom-product-modal/custom-product-modal.component';
import { TemplateDisplayComponent } from 'src/app/components/template-display/template-display.component';
import { PromoterDropdownComponent } from 'src/app/components/promoter-dropdown/promoter-dropdown.component';
import { DropdownCountryComponent } from 'src/app/components/dropdown-country/dropdown-country.component';
import { DropdownRetailerComponent } from 'src/app/components/dropdown-retailer/dropdown-retailer.component';
import { DropdownOutletComponent } from 'src/app/components/dropdown-outlet/dropdown-outlet.component';
import { DropdownPromoterComponent } from 'src/app/components/dropdown-promoter/dropdown-promoter.component';
import { CountryModalComponent } from 'src/app/components/country-modal/country-modal.component';
import { FormsModule } from '@angular/forms';



@NgModule({
  declarations: [FooterComponent, CustomDropdownComponent, CustomModalComponent, SearchDropdownComponent, SearchDropdownmodalComponent, CustomProductDropdownComponent,CustomProductModalComponent,TemplateDisplayComponent,PromoterDropdownComponent,DropdownCountryComponent,DropdownRetailerComponent,DropdownOutletComponent,DropdownPromoterComponent,CountryModalComponent],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule
  ],
  exports: [
    FooterComponent,
    CustomDropdownComponent,
    CustomModalComponent,
    SearchDropdownmodalComponent,
    SearchDropdownComponent,
    CustomProductDropdownComponent,
    CustomProductModalComponent,
    TemplateDisplayComponent,
    PromoterDropdownComponent,
    DropdownCountryComponent,
    DropdownRetailerComponent,
    DropdownOutletComponent,
    DropdownPromoterComponent,
    CountryModalComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SharedModule { }
