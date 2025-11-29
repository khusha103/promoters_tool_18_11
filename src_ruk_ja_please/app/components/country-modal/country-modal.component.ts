// import { Component, OnInit } from '@angular/core';

// @Component({
//   selector: 'app-country-modal',
//   templateUrl: './country-modal.component.html',
//   styleUrls: ['./country-modal.component.scss'],
// })
// export class CountryModalComponent  implements OnInit {

//   constructor() { }

//   ngOnInit() {}

// }

import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-country-modal',
  templateUrl: './country-modal.component.html',
  styleUrls: ['./country-modal.component.scss'],
})
export class CountryModalComponent {
  // selectedCountry: string = '';
  selectedCountry: any;

  selectedCountries: any[] = [];
  filteredCountries: any[] = [];
  countries: any[] = [];
  openDropdownIndex: number | null = 0;


  ngOnInit() {
    // this.fetchAllCountries();
    this.get_user_multicnt();
  }

  ionViewDidEnter() {
    // this.fetchAllCountries();

    this.get_user_multicnt();
  }

  get_user_multicnt() {
    const userID = localStorage.getItem('userId');
    if (userID) {
      this.apiService.getMultiRegionIdsNames(userID).subscribe(
        (response) => {
          if (response?.status) {
            this.countries = response.data;
            this.filteredCountries = [...this.countries];

            console.log("filter countries", this.filteredCountries);
          }
        },
        (error) => {
          console.error('Error fetching API:', error);
        }
      );
    }
  }


  constructor(private modalController: ModalController, private apiService: ApiService) { }


  saveCountry() {
    console.log(this.selectedCountry);
    if (this.selectedCountry) {
      // Save selected country to localStorage
      localStorage.setItem("cnt_wip", this.selectedCountry);
      //
      this.saveCountrySelection(this.selectedCountry);

      // Dismiss the modal and return the selected country
      this.modalController.dismiss(this.selectedCountry);
    } else {
      alert("Please select a country.");
    }
  }

  saveCountrySelection(cnt: string) {
    const userID = localStorage.getItem('userId');
    if (userID) {
      this.apiService.updateUserCountry(userID, cnt).subscribe(response => {
        console.log('Country updated successfully');
      }, error => {
        console.error('Error updating country:', error);
      });
    }
  }

  filterItems(event: any, type: string) {
    const searchTerm = event.target.value.toLowerCase(); // Get the search term
    switch (type) {
      case 'country':

        this.filteredCountries = this.countries.filter(country =>
          country.name.toLowerCase().includes(searchTerm)
        );
        break;

    }
  }


  fetchAllCountries() {
    this.apiService.getAllCountries().subscribe(
      (response) => {
        // Assuming response.data contains the array of countries
        this.countries = response.data;
        this.filteredCountries = [...this.countries];
      },
      (error) => {
        console.error('Error fetching countries:', error);
      }
    );
  }

  async selectItem(item: any, index: number) {
    switch (index) {
      case 0:
        this.selectedCountries[0] = item;
        console.log(this.selectedCountries[0]);
        this.selectedCountry = this.selectedCountries[0].id;

        break;

    }
    this.openDropdownIndex = null;
  }

  toggleDropdown(index: number) {
    this.openDropdownIndex = this.openDropdownIndex === index ? null : index;
  }
}

