import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-dropdown-test',
  templateUrl: './dropdown-test.page.html',
  styleUrls: ['./dropdown-test.page.scss'],
})
export class DropdownTestPage implements OnInit {

  // Sample data for each category
  stores = [
    { name: 'Store A' },
    { name: 'Store B' },
    { name: 'Store C' },
  ];

  cities = [
    { name: 'New York' },
    { name: 'Los Angeles' },
    { name: 'Chicago' },
  ];

  countries: any[] = []; 
  retailers: any[] = [];
  outlets: any[] = [];
  nationalities: any[] = [];
  filteredCountries: any[] = []; 
  filteredRetailers: any[] = []; 
  filteredOutlets: any[] = []; 
  filteredNationality: any[] = []; 



  designations = [
    { name: 'Manager' },
    { name: 'Sales Associate' },
    { name: 'Cashier' },
  ];

  filteredStores = this.stores;
  filteredCities = this.cities;
  filteredDesignations = this.designations;


  selectedStores: any[] = [];
  selectedCities: any[] = [];
  selectedCountries: any[] = [];
  selectedRetailers: any[] = [];
  selectedoutlets: any[] = [];
  selectednationalities: any[] = [];




  selectedDesignations: any[] = [];

  openDropdownIndex: number | null = null;

  constructor(private apiService: ApiService) { }

  ngOnInit() {
    this.fetchAllCountries();
    this.fetchNationalities();
  }




  toggleDropdown(index: number) {
    this.openDropdownIndex = this.openDropdownIndex === index ? null : index;
  }

  filterItems(event: any, type: string) {
    const searchTerm = event.target.value.toLowerCase(); // Get the search term
    switch (type) {
      case 'store':
        this.filteredStores = this.stores.filter(store => store.name.toLowerCase().includes(searchTerm));
        break;
      case 'city':
        this.filteredCities = this.cities.filter(city => city.name.toLowerCase().includes(searchTerm));
        break;
      case 'country':
        // Filter countries based on the search term
        this.filteredCountries = this.countries.filter(country =>
          country.name.toLowerCase().includes(searchTerm)
        );
        break;

      case 'retailer':
        // Filter countries based on the search term
        this.filteredRetailers = this.retailers.filter(retailer =>
          retailer.name.toLowerCase().includes(searchTerm)
        );
        break;

      case 'outlet':
        // Filter countries based on the search term
        this.filteredOutlets = this.outlets.filter(outlet =>
          outlet.name.toLowerCase().includes(searchTerm)
        );
        break;

      case 'nationality':
        // Filter countries based on the search term
        this.filteredNationality = this.nationalities.filter(nationality =>
          nationality.name.toLowerCase().includes(searchTerm)
        );
        break;

    }
  }

  selectItem(item: any, index: number) {
    switch (index) {
      case 0:
        this.selectedStores[0] = item; // Store selection
        break;
      case 1:
        this.selectedCities[0] = item; // City selection
        break;
      case 2:
        this.selectedCountries[0] = item; // Country selection
        this.retailers = [];
        this.outlets = [];
        const countryId = this.selectedCountries[0].id;

        if (countryId) {
          this.fetchRetailersByCountry(countryId);
        }
        break;
      case 3:
        this.selectedRetailers[0] = item; // Designation selection
        this.outlets = []; // Clear outlets when retailer changes

        if (this.selectedRetailers && this.selectedRetailers[0].id !== null) {
          this.fetchOutletsByRetailerAndCountry(this.selectedRetailers[0].id, this.selectedCountries[0].id);
        }
        break;
      case 4:
        this.selectedoutlets[0] = item; // Designation selection
        break;
      case 5:
        this.selectednationalities[0] = item; // Designation selection
        break;
    }
    this.openDropdownIndex = null; // Close the dropdown after selection
  }


  fetchAllCountries() {
    this.apiService.getAllCountries().subscribe(
      (response) => {
        // Assuming response.data contains the array of countries
        this.countries = response.data;
        console.log(this.countries); // Log the countries for debugging

        // Initialize filteredCountries with all countries
        this.filteredCountries = [...this.countries];
      },
      (error) => {
        console.error('Error fetching countries:', error);
      }
    );
  }


  fetchRetailersByCountry(countryId: number): Promise<void> {
    return new Promise((resolve, reject) => {
      this.apiService.getRetailersByCountry(countryId).subscribe(
        (response) => {
          if (response.status) {
            this.retailers = response.data;

            // Initialize filteredRetailers with all retailers
            this.filteredRetailers = [...this.retailers];


            // console.log("retailers",this.retailers);
            if (this.retailers.length === 0) {
              this.retailers.push({ id: null, name: 'No Retailers Found', disabled: true });
            }
            resolve();
          } else {
            this.retailers.push({ id: null, name: 'No Retailers Found', disabled: true });
            resolve();
          }
        },
        (error) => {
          console.error('Error fetching retailers:', error);
          this.retailers.push({ id: null, name: 'Error fetching retailers', disabled: true });
          reject(error);
        }
      );
    });
  }


  fetchOutletsByRetailerAndCountry(retailerId: number, countryId: number): Promise<void> {
    return new Promise((resolve, reject) => {
      this.apiService.getOutletsByRetailerAndCountry(retailerId, countryId).subscribe(
        (response) => {
          if (response.status) {
            this.outlets = response.data;


            // Initialize filteredRetailers with all retailers
            this.filteredOutlets = [...this.outlets];

            // Check if no outlets found
            if (this.outlets.length === 0) {
              this.outlets.push({ id: null, name: 'No Outlets Found', disabled: true });
            }
            resolve(); // Resolve the promise after fetching outlets
          } else {
            this.outlets.push({ id: null, name: 'No Outlets Found', disabled: true });
            resolve(); // Resolve even if no outlets found
          }
        },
        (error) => {
          console.error('Error fetching outlets:', error);
          this.outlets.push({ id: null, name: 'Error fetching outlets', disabled: true });
          reject(error); // Reject the promise on error
        }
      );
    });
  }


  fetchNationalities() {
    this.apiService.getNationalities().subscribe(
      (response) => {
        if (response.status) {
          this.nationalities = response.data; // Store the fetched nationalities
          // Initialize filteredRetailers with all retailers
          this.filteredNationality = [...this.nationalities];

        } else {
          console.error('Failed to fetch nationalities:', response.message);
        }
      },
      (error) => {
        console.error('Error fetching nationalities:', error);
      }
    );
  }


}
