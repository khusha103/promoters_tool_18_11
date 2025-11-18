import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-dropdown-country',
  templateUrl: './dropdown-country.component.html',
  styleUrls: ['./dropdown-country.component.scss'],
})
export class DropdownCountryComponent implements OnInit {

  selectedCountry: any;
  countries: any[] = [];
  filteredCountries: any[] = [];
  searchText: string = '';

  constructor(private apiService: ApiService, private modalController: ModalController) {}

  ngOnInit() {
    this.loadCountries();
  }

  loadCountries() {
    return new Promise((resolve, reject) => {
      this.apiService.getAllCountries().subscribe(
          (response) => {
              this.countries = response.data;
              console.log(this.countries);
              this.filteredCountries = response.data;
              resolve(this.countries);
          },
          (error) => {
              console.error('Error fetching countries:', error);
              reject(error);
          }
      );
    });
  }

  filterCountries(event: any) {
    this.searchText = event.target.value.toLowerCase();
    this.filteredCountries = this.countries.filter(country =>
      country.name.toLowerCase().includes(this.searchText) ||
      (country.cnt_code && country.cnt_code.toLowerCase().includes(this.searchText))
    );
  }
  

  selectCountry(country: any) {
    this.selectedCountry = country;
    this.modalController.dismiss(country);
  }

  closeModal() {
    this.modalController.dismiss();
  }
}
