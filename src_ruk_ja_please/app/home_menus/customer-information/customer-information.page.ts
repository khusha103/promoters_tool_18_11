import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, PopoverController } from '@ionic/angular';
import { PopoverContentComponent } from 'src/app/components/popover-content/popover-content.component';
import { ApiService } from 'src/app/services/api.service';
import { UserService } from 'src/app/services/user.service';


export interface Field {
  id: number;
  field_name: string;
  field_slug: string;
  created_on: string;
  category_id: number;
  status: number;
  category_name: string;
  multiple_select: number;
  selectedValue?: any;
}

export interface Option {
  id: number;
  old_id: number;
  name: string;
  field_id: number;
  cat_id: number;
  status: number;
  created_on: string;
}

@Component({
  selector: 'app-customer-information',
  templateUrl: './customer-information.page.html',
  styleUrls: ['./customer-information.page.scss'],
})
export class CustomerInformationPage {

  feedback: string = '';
  showAlert: boolean = false;
  alertTitle: string = '';
  alertMessage: string = '';
  alertButtonText: string = '';


  constructor(private router: Router, private apiService: ApiService, private alertController: AlertController, private userService: UserService,private popoverController:PopoverController) { }

  // Dropdown properties
  selectedProduct: any;
  products: any[] = [];

  selectedProfile: any;
  profiles: any[] = [];

  selectedBrand: any;
  brands: any[] = [];

  // Dropdown properties
  selectedPrimaryGenre: any;
  selectedSecondaryGenre: any;
  primary_genres: any[] = [];
  secondary_genres: any[] = [];


  // Dropdown properties for genres and platforms
  selectedMoviesGenre: any;
  moviesGenres: any[] = [];

  selectedMoviesPlatform: any;
  moviesPlatforms: any[] = [];

  selectedMusicGenre: any;
  musicGenres: any[] = [];

  selectedMusicPlatform: any;
  musicPlatforms: any[] = [];

  selectedTypeOfUsage: any; 
  typesOfUsage: any[] = [];

  // Visibility flags
  showMoviesDropdowns: boolean = false;
  showTypesOfUsage: boolean = false;

  showMusicDropdowns: boolean = false;
  hideAllDropdowns: boolean = false;

  countries: any[] = [];
  retailers: any[] = [];
  outlets: any[] = [];
  categories: any[] = [];
  preferences: any[] = [];
  genders: any[] = [];

  ageBrackets: any[] = [];
  socialMediaOptions: any[] = [];
  nationalities: any[] = [];

  selectedNationality: any;
  selectedPointOfAwareness: any;
  selectedCountry: any;
  selectedRetailer: any;
  selectedOutlet: any;
  selectedCategory: any;
  selectedPreference: any;
  selectedGender: any;
  selectedAgeBracket: any;

  selectedFromDate!: string; 
  isFromPopoverOpen: boolean = false; 

  filteredCountries: any[] = [];
  filteredRetailers: any[] = [];
  filteredOutlets: any[] = [];
  filteredNationality: any[] = [];
  filteredCategory: any[] = [];
  filteredPreference: any[] = [];
  filteredGenders: any[] = [];
  filteredAges: any[] = [];
  filteredProducts: any[] = [];





  selectedCountries: any[] = [];
  selectedRetailers: any[] = [];
  selectedoutlets: any[] = [];
  selectednationalities: any[] = [];
  selectedCategories: any[] = [];
  selectedPreferences: any[] = [];
  selectedGenders: any[] = [];
  selectedAges: any[] = [];
  selectedProducts: any[] = [];



  //custom dyanamic fields
  openDynamicDropdownIndex: number | null = null;
  selectedFields: { [key: string]: any } = {};
  filteredOptions: { [key: number]: any[] } = {};
  DynamicoptionsMap: { [key: number]: any[] } = {};
  multipleSelectedOptions: { [key: string]: any[] } = {}; // for multiple select fields

  //custom dyanamic fields




  openDropdownIndex: number | null = null;

  fields: Field[] = [];
  optionsMap: { [key: number]: Option[] } = {}; 

  ngOnInit() {
    this.fetchAllCountries();
    this.fetchAllCategories();
    this.fetchPreferences();
    this.fetchGenders();
    this.fetchAgeBrackets();
    this.fetchNationalities();
    this.fetchUserData(); //fetch userdata from login
  }

  ionViewDidEnter() {
    this.fetchAllCountries();
    this.fetchAllCategories();
    this.fetchPreferences();
    this.fetchGenders();
    this.fetchAgeBrackets();
    this.fetchNationalities();
    this.fetchUserData(); // Fetch user data on initialization
  }

  // Function to present the popover with dynamically inserted HTML content
  async presentPopover(event: Event, fullText: string) {
    event.stopPropagation(); // Prevent the dropdown item from being selected

    const popover = await this.popoverController.create({
      component: PopoverContentComponent,
      event: event,
      translucent: true,
      cssClass: 'tooltip-popover', // Custom class for styling
      componentProps: {
        tooltipText: fullText // Pass the full text to the popover
      },
    });

    await popover.present(); // Present the popover
  }
  

  fetchUserData() {
    const userIdString = localStorage.getItem('userId');
    const userId = userIdString ? Number(userIdString) : null;

    if (userId !== null) {
      this.userService.fetchUserData(userId).subscribe(
        (response) => {
          if (response.status) {
            this.setUserData(response.data);
            // this.setSelectedCategory(response.data.categories);

          } else {
            console.error('Failed to fetch user data:', response.message);
          }
        },
        (error) => {
          console.error('Error fetching user data:', error);
        }
      );
    }
  }

  setUserData(userData: any) {
    const country = this.countries.find(c => c.name === userData.countryname);
    if (country) {
      this.selectedCountry = country;
    }


    this.fetchRetailersByCountry(this.selectedCountry.id).then(() => {

      const retailer = this.retailers.find(r => r.name === userData.retailer_name);
      if (retailer) {
        this.selectedRetailer = retailer;
      }

      // console.log("sdasdasdasd",this.selectedRetailer.id, this.selectedCountry.id);
      this.fetchOutletsByRetailerAndCountry(this.selectedRetailer.id, this.selectedCountry.id).then(() => {
        const outlet = this.outlets.find(o => o.name === userData.store_name);
        if (outlet) {
          this.selectedOutlet = outlet;
        }
      });
    });
  }


  toggleDropdown(index: number) {
    this.openDropdownIndex = this.openDropdownIndex === index ? null : index;
  }

  filterItems(event: any, type: string) {
    const searchTerm = event.target.value.toLowerCase(); // Get the search term
    switch (type) {
      case 'country':

        this.filteredCountries = this.countries.filter(country =>
          country.name.toLowerCase().includes(searchTerm)
        );
        break;

      case 'retailer':

        this.filteredRetailers = this.retailers.filter(retailer =>
          retailer.name.toLowerCase().includes(searchTerm)
        );
        break;

      case 'outlet':

        this.filteredOutlets = this.outlets.filter(outlet =>
          outlet.name.toLowerCase().includes(searchTerm)
        );
        break;

      case 'category':

        this.filteredCategory = this.categories.filter(category =>
          category.name.toLowerCase().includes(searchTerm)
        );
        break;

      case 'preference':

        this.filteredPreference = this.preferences.filter(preference =>
          preference.name.toLowerCase().includes(searchTerm)
        );
        break;

      case 'gender':

        this.filteredPreference = this.preferences.filter(preference =>
          preference.name.toLowerCase().includes(searchTerm)
        );
        break;

      case 'Age':

        this.filteredAges = this.ageBrackets.filter(age =>
          age.name.toLowerCase().includes(searchTerm)
        );
        break;

      case 'product':

        this.filteredProducts = this.products.filter(product =>
          product.name.toLowerCase().includes(searchTerm)
        );
        break;

      case 'nationality':

        this.filteredNationality = this.nationalities.filter(nationality =>
          nationality.name.toLowerCase().includes(searchTerm)
        );
        break;

    }
  }

  // async selectItem(item: any, index: number) {
  //   switch (index) {
  //     case 0:
  //       this.selectedCountries[0] = item; // Country selection
  //       this.retailers = [];
  //       this.outlets = [];
  //       const countryId = this.selectedCountries[0].id;

  //       //on change country reset selacted values of retailer and stores
  //       this.selectedRetailer = "";
  //       this.selectedOutlet = "";
  //       // console.log("contryid", countryId);

  //       if (countryId) {
  //         this.fetchRetailersByCountry(countryId);
  //       }
  //       break;
  //     case 1:
  //       this.selectedRetailers[0] = item;
  //       this.outlets = []; // Clear outlets when retailer changes

  //       if (this.selectedRetailers && this.selectedRetailers[0].id !== null) {
  //         // const countryId = this.selectedCountry ? this.selectedCountry.id : this.selectedCountries[0].id;
  //         const countryId = this.selectedCountries[0] ? this.selectedCountries[0].id : this.selectedCountry.id;

  //         this.fetchOutletsByRetailerAndCountry(this.selectedRetailers[0].id, countryId);
  //       }
  //       //reset selected userdata outlet on change retailer
  //       this.selectedOutlet = "";
  //       break;
  //     case 2:
  //       this.selectedoutlets[0] = item;
  //       // console.log(this.selectedoutlets[0]);
  //       break;
  //     case 3:
  //       this.selectedCategories[0] = item;
  //       if (this.selectedCategories && this.selectedCategories[0].id !== null) {
  //         this.fetchProductsByCategory(this.selectedCategories[0].id);
  //         await this.fetchFields(this.selectedCategories[0].id);
  //       }
  //       break;
  //     case 4:
  //       this.selectedPreferences[0] = item;
  //       // console.log(this.selectedPreferences[0]);
  //       break;
  //     case 5:
  //       this.selectedGenders[0] = item;
  //       // console.log(this.selectedGenders[0]);
  //       break;
  //     case 6:
  //       this.selectedAges[0] = item;
  //       // console.log(this.selectedAges[0]);
  //       break;
  //     case 7:
  //       this.selectedProducts[0] = item;
  //       // console.log(this.selectedProducts[0]);
  //       break;
  //     case 8:
  //       this.selectednationalities[0] = item;
  //       // console.log(this.selectednationalities[0]);
  //       break;
  //   }
  //   this.openDropdownIndex = null; // Close the dropdown after selection
  // }


  async selectItem(item: any, index: number) {
  switch (index) {
    case 0:
      this.selectedCountries[0] = item;
      this.retailers = [];
      this.outlets = [];
      const countryId = this.selectedCountries[0].id;
      this.selectedRetailer = "";
      this.selectedOutlet = "";
      if (countryId) {
        this.fetchRetailersByCountry(countryId);
      }
      break;
    case 1:
      this.selectedRetailers[0] = item;
      this.outlets = [];
      if (this.selectedRetailers && this.selectedRetailers[0].id !== null) {
        const countryId = this.selectedCountries[0] ? this.selectedCountries[0].id : this.selectedCountry.id;
        this.fetchOutletsByRetailerAndCountry(this.selectedRetailers[0].id, countryId);
      }
      this.selectedOutlet = "";
      break;
    case 2:
      this.selectedoutlets[0] = item;
      break;
    case 3:
      this.selectedCategories[0] = item;
      this.selectedFields = {}; // Reset dynamic fields
      this.filteredOptions = {}; // Reset filtered options
      if (this.selectedCategories && this.selectedCategories[0].id !== null) {
        this.fetchProductsByCategory(this.selectedCategories[0].id);
        await this.fetchFields(this.selectedCategories[0].id);
      }
      break;
    case 4:
      this.selectedPreferences[0] = item;
      break;
    case 5:
      this.selectedGenders[0] = item;
      break;
    case 6:
      this.selectedAges[0] = item;
      break;
    case 7:
      this.selectedProducts[0] = item;
      break;
    case 8:
      this.selectednationalities[0] = item;
      break;
  }
  this.openDropdownIndex = null; // Close the dropdown after selection
}

  //--------custom for dynamic fields-------------------------------

  // Dynamic_toggleDropdown(index: number) {
  //   this.openDynamicDropdownIndex = this.openDynamicDropdownIndex === index ? null : index;
  // }

  // DynamicfilterItems(event: any, fieldID: number) {
  //   const searchTerm = event.target.value.toLowerCase();
  //   if (!searchTerm) {
  //     this.filteredOptions[fieldID] = this.optionsMap[fieldID];
  //   } else {
  //     this.filteredOptions[fieldID] = this.optionsMap[fieldID].filter(option =>
  //       option.name.toLowerCase().includes(searchTerm)
  //     );
  //   }
  // }

  DynamicfilterItems(event: any, fieldId: number) {
  const query = event.target.value.toLowerCase();
  const originalOptions = this.filteredOptions[fieldId] || [];
  this.filteredOptions[fieldId] = originalOptions.filter(option =>
    option.name.toLowerCase().includes(query)
  );
}



  // DynamicselectItem(option: any, field: any) {
  //   this.selectedFields[field.field_slug] = option;
  //   //at first i padd field.id so not get (field.slug)object
  //   // console.log(this.selectedFields[field.field_slug]);
  //   this.openDynamicDropdownIndex = null; // Close dropdown after selection
  // }

//   DynamicselectItem(option: any, field: any) {
//   this.selectedFields[field.id] = option; // Store selected option by field.id
//   this.openDynamicDropdownIndex = null; // Close the dropdown after selection
// }


//   DynamicselectItem(option: any, field: any) {
//   this.selectedFields[field.field_slug] = option; // Store selected option by field_slug
//   this.openDynamicDropdownIndex = null; // Close the dropdown after selection
// }


  

  // async fetchFields(catID: number) {
  //   try {
  //     const response = await this.apiService.getFields(catID);
  //     console.log("Dynamic dropdown fields",response);
  //     if (response.status) {
  //       this.fields = response.data; // Assign fetched fields to the component property
  //       console.log("dynamic field according to category",this.fields);

//         [
//     {
//         "id": "11",
//         "field_name": "Profile",
//         "field_slug": "profile",
//         "created_on": "2024-09-21 17:08:36",
//         "category_id": "2",
//         "status": "1",
//         "category_name": "Digital Imaging",
//         "multiple_select": "0"
//     },
//     {
//         "id": "12",
//         "field_name": "Primary Genre",
//         "field_slug": "primary_genre",
//         "created_on": "2024-09-21 17:08:36",
//         "category_id": "2",
//         "status": "1",
//         "category_name": "Digital Imaging",
//         "multiple_select": "0"
//     },
//     {
//         "id": "13",
//         "field_name": "Secondary Genre",
//         "field_slug": "usage_secondary",
//         "created_on": "2024-09-21 17:08:36",
//         "category_id": "2",
//         "status": "1",
//         "category_name": "Digital Imaging",
//         "multiple_select": "0"
//     },
//     {
//         "id": "14",
//         "field_name": "Previous Brands",
//         "field_slug": "previous_brands",
//         "created_on": "2024-09-21 17:08:36",
//         "category_id": "2",
//         "status": "1",
//         "category_name": "Digital Imaging",
//         "multiple_select": "0"
//     },
//     {
//         "id": "15",
//         "field_name": "Social Media",
//         "field_slug": "social_media",
//         "created_on": "2024-09-21 17:08:36",
//         "category_id": "2",
//         "status": "1",
//         "category_name": "Digital Imaging",
//         "multiple_select": "0"
//     }
// ]
  //       await this.fetchOptionsForFields(catID); // Fetch options for each field
  //     } else {
  //       console.error('Failed to fetch fields:', response.message);
  //     }
  //   } catch (error) {
  //     // console.error('Error fetching fields:', error);
  //   }
  // }

  async fetchOptionsForFields(catID: number) {
    for (const field of this.fields) {
      try {
        const response = await this.apiService.getOptions(field.id, catID);
        if (response.status) {
          this.optionsMap[field.id] = response.data; // Store options in the map
          this.filteredOptions[field.id] = response.data; // Initialize filtered options with the full list
          // console.log(field.id, response.data);
        } else {
          console.error('Failed to fetch options for field:', field.id, response.message);
        }
      } catch (error) {
        console.error('Error fetching options for field:', field.id, error);
      }
    }
  }

//   async fetchOptionsForFields(catID: number) {
//   try {
//     const response = await this.apiService.getOptionsForFields(catID);
//     if (response.status) {
//       this.filteredOptions = response.data.reduce((acc, option) => {
//         if (!acc[option.field_id]) {
//           acc[option.field_id] = [];
//         }
//         acc[option.field_id].push(option);
//         return acc;
//       }, {});
//     } else {
//       console.error('Failed to fetch options:', response.message);
//     }
//   } catch (error) {
//     console.error('Error fetching options:', error);
//   }
// }

  //--------custom for dynamic fields-------------------------------

  fetchAllCategories() {
    this.apiService.getAllCategories().subscribe(
      (response) => {
        if (response.status) { // Assuming your API response has a status field
          this.categories = response.data; // Store the fetched categories
          this.filteredCategory = [...this.categories];
        } else {
          console.error('Failed to fetch categories:', response.message);
        }
      },
      (error) => {
        console.error('Error fetching categories:', error);
      }
    );
  }

  fetchAllCountries() {
    this.apiService.getAllCountries().subscribe(
      (response) => {
        // Assuming response.data contains the array of countries
        this.countries = response.data;
        // console.log(this.countries); // Log the countries for debugging


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

            // Initialize filteredfields
            this.filteredRetailers = [...this.retailers];


            // console.log("retailers",this.retailers);
            if (this.retailers.length === 0) {
              this.filteredRetailers = []; // Empty filteredRetailers
              this.filteredOutlets = []; // Empty filteredOutlets
              // this.filteredRetailers.push({ id: null, name: 'No Retailers Found', disabled: true });
            }
            resolve();
          } else {
            this.filteredRetailers = []; // Empty filteredRetailers
            this.filteredOutlets = []; // Empty filteredOutlets
            // this.filteredRetailers.push({ id: null, name: 'No Retailers Found', disabled: true });
            resolve();
          }
        },
        (error) => {
          console.error('Error fetching retailers:', error);
          this.filteredRetailers = []; // Empty filteredRetailers
          this.filteredOutlets = []; // Empty filteredOutlets
          // this.filteredRetailers.push({ id: null, name: 'Error fetching retailers', disabled: true });
          reject(error);
        }
      );
    });
  }


  fetchOutletsByRetailerAndCountry(retailerId: number, countryId: number): Promise<void> {
    return new Promise((resolve, reject) => {
        this.apiService.getOutletsByRetailerAndCountry(retailerId, countryId).subscribe(
            (response) => {
                // Check if the response is successful
                if (response.status) {
                    this.outlets = response.data;

                    // Check if no outlets were found
                    if (this.outlets.length === 0) {
                        // Clear filteredOutlets and push the message
                        this.filteredOutlets = []; // Empty filteredOutlets
                        this.filteredOutlets.push({ id: null, name: 'No Outlets Found', disabled: true });
                    } else {
                        // If outlets are found, assign them to filteredOutlets
                        this.filteredOutlets = [...this.outlets];
                    }
                } else {
                    // Handle case where status is false
                    this.filteredOutlets = []; // Empty filteredOutlets
                    this.filteredOutlets.push({ id: null, name: 'No Outlets Found', disabled: true });
                }
                resolve(); // Resolve the promise after processing the response
            },
            (error) => {
                console.error('Error fetching outlets:', error);
                this.filteredOutlets = []; // Empty filteredOutlets on error
                this.filteredOutlets.push({ id: null, name: 'Error fetching outlets', disabled: true });
                reject(error); // Reject the promise on error
            }
        );
    });
}
  async setSelectedCategory(categoriesString: string) {
    const categoriesArray = categoriesString.split(',').map(category => category.trim());
    this.selectedCategory = this.categories.find(category => categoriesArray.includes(category.category_name));

    //on get user first category then show drodpown data accordingly
    const catId = this.selectedCategory.id;
    this.fetchProductsByCategory(catId);
    await this.fetchFields(catId);
  }

  // -------------------all Independent Dropdowns---------------------
  fetchPreferences() {
    this.apiService.getPreferences().subscribe(
      (response) => {
        if (response.status) {
          this.preferences = response.data;

          // Initialize filteredfields
          this.filteredPreference = [...this.preferences];
          // console.log("abc",this.preferences);
        } else {
          console.error('Failed to fetch preferences:', response.message);
        }
      },
      (error) => {
        console.error('Error fetching preferences:', error);
      }
    );
  }

  fetchGenders() {
    this.apiService.getGenders().subscribe(
      (response) => {
        if (response.status) {
          this.genders = response.data;

          // Initialize filteredfields
          this.filteredGenders = [...this.genders];

        } else {
          console.error('Failed to fetch genders:', response.message);
        }
      },
      (error) => {
        console.error('Error fetching genders:', error);
      }
    );
  }

  fetchAgeBrackets() {
    this.apiService.getAgeBrackets().subscribe(
      (response) => {
        if (response.status) {
          this.ageBrackets = response.data;
          // Initialize filteredfields
          this.filteredAges = [...this.ageBrackets];
        } else {
          console.error('Failed to fetch age brackets:', response.message);
        }
      },
      (error) => {
        console.error('Error fetching age brackets:', error);
      }
    );
  }


  fetchNationalities() {
    this.apiService.getNationalities().subscribe(
      (response) => {
        if (response.status) {
          this.nationalities = response.data; // Store the fetched nationalities
          // Initialize filteredfields
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

  fetchProductsByCategory(categoryId: number) {
    this.apiService.getProductsByCategory(categoryId).subscribe(
      (response) => {
        if (response.status) {
          this.products = response.data; // Store fetched products
          // Initialize filteredfields
          this.filteredProducts = [...this.products];
        } else {
          console.error('Failed to fetch products:', response.message);
        }
      },
      (error) => {
        console.error('Error fetching products:', error);
        this.products = []; // Reset products if an error occurs
      }
    );
  }

  resetDropdowns() {
    // Reset all dependent dropdowns if no category is selected
  }


  openFromPopover() {
    this.isFromPopoverOpen = true; // Open the popover
  }

  closeFromPopover() {
    this.isFromPopoverOpen = false; // Close the popover
  }

  onFromDateChange(event: any) {
    this.selectedFromDate = event.detail.value; // Update the selected date
    this.closeFromPopover(); // Close the popover after selecting a date
    // console.log('Selected From Date:', this.selectedFromDate);
  }

  // getcategorywise_dynamic_fields(){

  // }


//   async onSubmit() {
//     // Validate the form before submission
//     const missingFields = this.validateForm(); // Get missing fields

//     if (missingFields.length === 0) {
//         // Show confirmation alert before submitting
//         const alert = await this.alertController.create({
//             header: 'Confirm Submission',
//             message: 'Are you sure you want to submit this form?',
//             buttons: [
//                 {
//                     text: 'Cancel',
//                     role: 'cancel',
//                     handler: () => {
//                         console.log('Submission cancelled');
//                     }
//                 },
//                 {
//                     text: 'Confirm',
//                     handler: async () => {
//                         // If user confirms, proceed with form submission
//                         const submittedData: { [key: string]: any } = {};

//                         const userIdString = localStorage.getItem('userId'); // Replace 'user_id' with your actual key
//                         const userId = userIdString ? Number(userIdString) : null; // Convert to number

//                         if (userId !== null) {
//                           submittedData['user_id'] = userId;
//                         }

//                         submittedData['country'] = this.selectedCountries[0] ? this.selectedCountries[0].id : this.selectedCountry.id;

//                         submittedData['retailer'] = this.selectedRetailers[0] ? this.selectedRetailers[0].id : this.selectedRetailer.id;

//                         submittedData['outlet'] = this.selectedoutlets[0] ? this.selectedoutlets[0].id : this.selectedOutlet.id; 

//                         submittedData['category'] = this.selectedCategories[0] ? this.selectedCategories[0].id : this.selectedCategory.id; 

//                         submittedData['preference'] = this.selectedPreferences[0].id;
//                         submittedData['gender'] = this.selectedGenders[0].id;
//                         submittedData['ageBracket'] = this.selectedAges[0].id;
//                         submittedData['nationality'] = this.selectednationalities[0].id;
//                         submittedData['product'] = this.selectedProducts[0].id;
//                         submittedData['feedback'] = this.feedback;
//                         submittedData['datemention'] = this.selectedFromDate;

                        
//                         this.fields.forEach(field => {
//                             const fieldSlug = field.field_slug; 
//                             const selectedValue = this.selectedFields[fieldSlug]; 

//                            console.log("selected value",selectedValue);

                            
//                             if (selectedValue) {
//                                 const fieldValue = selectedValue.id; 
//                                 const fieldIndication = fieldValue ? '_dynamicField' : '_not_dynamicField';

//                                 console.log("filedInduction",fieldIndication);

//                                 // Concatenate the field name with the indication and store it in the submittedData
//                                 // submittedData[`${field.field_name}${fieldIndication}`] = fieldValue;
//                                 submittedData[`${field.field_name}${fieldIndication}_${field.id}`] = fieldValue;
//                                 //on basis of _filedid now add check all filled by user ir not whatever get oncategory change if not all fileds then show error 
//                                 // +also do this check on basis of id not field name

//                             } else {
//                                 // If no value is selected, you can still log or handle the field if necessary
//                                 console.warn(`No value selected for ${field.field_name}`);
//                             }
//                         });

//                         console.log('Submitted Data:', submittedData);

//                         // Submit the form data
//                         this.apiService.submitCustomerInfo(submittedData).subscribe(
//                           async (response) => {
//                             // console.log('Form submitted successfully', response);
//                             await this.presentAlert('Success', 'Your information has been submitted successfully.');
//                             // Navigate to home page after alert is dismissed
//                             this.router.navigate(['/home']);
//                           },
//                           async (error) => {
//                             console.error('Error submitting form', error);
//                             await this.presentAlert('Error', 'There was an error submitting your information. Please try again.');
//                           }
//                         );
//                     }
//                 }
//             ]
//         });

//         // Present the confirmation alert
//         await alert.present();
      
//     } else {
//       await this.presentAlert('Error', `Please fill all required fields: ${missingFields.join(', ')}`);
//     }
// }


// DynamictoggleMultiSelect(field: any, option: any) {
//   if (!this.multipleSelectedOptions[field.field_slug]) {
//     this.multipleSelectedOptions[field.field_slug] = [];
//   }

//   const exists = this.isOptionSelected(field.field_slug, option.id);

//   if (exists) {
//     this.multipleSelectedOptions[field.field_slug] =
//       this.multipleSelectedOptions[field.field_slug].filter(o => o.id !== option.id);
//   } else {
//     this.multipleSelectedOptions[field.field_slug].push(option);
//   }

//   console.log('Selected options for', field.field_slug, this.multipleSelectedOptions[field.field_slug]);
// }

hasSelected(field: any): boolean {
  if (field.multiple_select == '1') {
    return (this.multipleSelectedOptions[field.field_slug] || []).length > 0;
  }
  return !!this.selectedFields[field.field_slug];
}

 Dynamic_toggleDropdown(index: number) {
    this.openDynamicDropdownIndex = this.openDynamicDropdownIndex === index ? null : index;
  }

  // DynamicfilterItems(event: any, fieldID: number) {
  //   const searchTerm = event.target.value.toLowerCase();
  //   if (!searchTerm) {
  //     this.filteredOptions[fieldID] = this.optionsMap[fieldID];
  //   } else {
  //     this.filteredOptions[fieldID] = this.optionsMap[fieldID].filter(option =>
  //       option.name.toLowerCase().includes(searchTerm)
  //     );
  //   }
  // }


DynamicselectItem(option: any, field: any) {
  this.selectedFields[field.field_slug] = option;
  this.openDynamicDropdownIndex = null; // Close dropdown after selection
  console.log('Selected single option:', this.selectedFields);
}
getSelectedNames(field: any): string {
  const selected = this.multipleSelectedOptions[field.field_slug] || [];
  return selected.map(o => o.name).join(', ');
}

  

async fetchFields(catID: number) {
  try {
    const response = await this.apiService.getFields(catID);
    console.log("Dynamic dropdown fields", response);

    if (response.status) {
      this.fields = response.data; // Assign fetched fields to the component property

      // ✅ Initialize empty arrays for multiple-select fields
      this.fields.forEach(field => {
        if (field.multiple_select === 1) {
          this.multipleSelectedOptions[field.field_slug] = [];
        }
      });

      await this.fetchOptionsForFields(catID); // Fetch options for each field
      console.log("field------>", response.data);
    } else {
      console.error('Failed to fetch fields:', response.message);
    }
  } catch (error) {
    // console.error('Error fetching fields:', error);
  }
}

DynamictoggleMultiSelect(field: any, option: any) {
  if (!this.multipleSelectedOptions[field.field_slug]) {
    this.multipleSelectedOptions[field.field_slug] = [];
  }

  const exists = this.isOptionSelected(field.field_slug, option.id);

  if (exists) {
    this.multipleSelectedOptions[field.field_slug] =
      this.multipleSelectedOptions[field.field_slug].filter(o => o.id !== option.id);
  } else {
    this.multipleSelectedOptions[field.field_slug].push(option);
  }

  console.log('Selected options for', field.field_slug, this.multipleSelectedOptions[field.field_slug]);
}

isOptionSelected(fieldSlug: string, optionId: number): boolean {
  return (this.multipleSelectedOptions[fieldSlug] || []).some(o => o.id === optionId);
}
  // async fetchOptionsForFields(catID: number) {
  //   for (const field of this.fields) {
  //     try {
  //       const response = await this.apiService.getOptions(field.id, catID);
  //       if (response.status) {
  //         this.optionsMap[field.id] = response.data; // Store options in the map
  //         this.filteredOptions[field.id] = response.data; // Initialize filtered options with the full list
  //         // console.log(field.id, response.data);
  //       } else {
  //         console.error('Failed to fetch options for field:', field.id, response.message);
  //       }
  //     } catch (error) {
  //       console.error('Error fetching options for field:', field.id, error);
  //     }
  //   }
  // }


// async onSubmit() {
//   // Validate the form before submission
//   const missingFields = this.validateForm();

//   if (missingFields.length === 0) {
//     // Show confirmation alert before submitting
//     const alert = await this.alertController.create({
//       header: 'Confirm Submission',
//       message: 'Are you sure you want to submit this form?',
//       buttons: [
//         {
//           text: 'Cancel',
//           role: 'cancel',
//           handler: () => {
//             console.log('Submission cancelled');
//           },
//         },
//         {
//           text: 'Confirm',
//           handler: async () => {
//             const submittedData: { [key: string]: any } = {};

//             const userIdString = localStorage.getItem('userId');
//             const userId = userIdString ? Number(userIdString) : null;

//             if (userId !== null) {
//               submittedData['user_id'] = userId;
//             }

//             // Assign static field values
//             submittedData['country'] = this.selectedCountries[0]
//               ? this.selectedCountries[0].id
//               : this.selectedCountry?.id;
//             submittedData['retailer'] = this.selectedRetailers[0]
//               ? this.selectedRetailers[0].id
//               : this.selectedRetailer?.id;
//             submittedData['outlet'] = this.selectedoutlets[0]
//               ? this.selectedoutlets[0].id
//               : this.selectedOutlet?.id;
//             submittedData['category'] = this.selectedCategories[0]
//               ? this.selectedCategories[0].id
//               : this.selectedCategory?.id;
//             submittedData['preference'] = this.selectedPreferences[0]?.id;
//             submittedData['gender'] = this.selectedGenders[0]?.id;
//             submittedData['ageBracket'] = this.selectedAges[0]?.id;
//             submittedData['nationality'] = this.selectednationalities[0]?.id;
//             submittedData['product'] = this.selectedProducts[0]?.id;
//             submittedData['feedback'] = this.feedback;
//             submittedData['datemention'] = this.selectedFromDate;

//             // Assign dynamic field values
//             this.fields.forEach(field => {
//               const selectedValue = this.selectedFields[field.id];

//               if (selectedValue) {
//                 const fieldValue = selectedValue.id;
//                 const fieldIndication = fieldValue ? '_dynamicField' : '_not_dynamicField';
//                 // Use field.id to ensure uniqueness
//                 submittedData[`${field.field_slug}${fieldIndication}_${field.id}`] = fieldValue;
//               } else {
//                 console.warn(`No value selected for ${field.field_name} (ID: ${field.id})`);
//               }
//             });

//             console.log('Submitted Data:', submittedData);

//             // Submit the form data
//             // try {
//             //   const response = await this.apiService.submitCustomerInfo(submittedData).toPromise();
//             //   await this.presentAlert('Success', 'Your information has been submitted successfully.');
//             //   this.router.navigate(['/home']);
//             // } catch (error) {
//             //   console.error('Error submitting form', error);
//             //   await this.presentAlert('Error', 'There was an error submitting your information. Please try again.');
//             // }
//           },
//         },
//       ],
//     });

//     await alert.present();
//   } else {
//     await this.presentAlert('Error', `Please fill all required fields: ${missingFields.join(', ')}`);
//   }
// }

 async onSubmit() {
  const missingFields = this.validateForm();

  if (missingFields.length === 0) {
    const alert = await this.alertController.create({
      header: 'Confirm Submission',
      message: 'Are you sure you want to submit this form?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Submission cancelled');
          },
        },
        {
          text: 'Confirm',
          handler: async () => {
            const submittedData: { [key: string]: any } = {};

            const userIdString = localStorage.getItem('userId');
            const userId = userIdString ? Number(userIdString) : null;

            if (userId !== null) {
              submittedData['user_id'] = userId;
            }

            submittedData['country'] = this.selectedCountries[0]
              ? this.selectedCountries[0].id
              : this.selectedCountry?.id;
            submittedData['retailer'] = this.selectedRetailers[0]
              ? this.selectedRetailers[0].id
              : this.selectedRetailer?.id;
            submittedData['outlet'] = this.selectedoutlets[0]
              ? this.selectedoutlets[0].id
              : this.selectedOutlet?.id;
            submittedData['category'] = this.selectedCategories[0]
              ? this.selectedCategories[0].id
              : this.selectedCategory?.id;
            submittedData['preference'] = this.selectedPreferences[0]?.id;
            submittedData['gender'] = this.selectedGenders[0]?.id;
            submittedData['ageBracket'] = this.selectedAges[0]?.id;
            submittedData['nationality'] = this.selectednationalities[0]?.id;
            submittedData['product'] = this.selectedProducts[0]?.id;
            submittedData['feedback'] = this.feedback;
            submittedData['datemention'] = this.selectedFromDate;

            // Assign dynamic field values
            this.fields.forEach(field => {
              const selectedValue = this.selectedFields[field.id];

              if (selectedValue) {
                const fieldValue = selectedValue.id;
                const fieldIndication = fieldValue ? '_dynamicField' : '_not_dynamicField';
                // Use field.id to ensure uniqueness
                submittedData[`${field.field_slug}${fieldIndication}_${field.id}`] = fieldValue;
              } else {
                console.warn(`No value selected for ${field.field_name} (ID: ${field.id})`);
              }
            });
            this.fields.forEach(field => {
  const fieldSlug = field.field_slug;

  if (this.multipleSelectedOptions[fieldSlug] && this.multipleSelectedOptions[fieldSlug].length > 0) {
    submittedData[fieldSlug] = this.multipleSelectedOptions[fieldSlug];
  } else if (this.selectedFields[fieldSlug]) {
    submittedData[fieldSlug] = this.selectedFields[fieldSlug].id;
  }
});
this.fields.forEach(field => {
  const fieldSlug = field.field_slug; // backend slug
  const fieldId = field.id; // dynamic field ID

  if (this.multipleSelectedOptions[fieldSlug] && this.multipleSelectedOptions[fieldSlug].length > 0) {
    // Multi-select: IDs ka comma separated string
    const ids = this.multipleSelectedOptions[fieldSlug].map(o => o.id);
    submittedData[`${fieldSlug}_dynamicField_${fieldId}`] = ids.join(',');
  } 
  else if (this.selectedFields[fieldSlug] && this.selectedFields[fieldSlug].id) {
    // Single select
    submittedData[`${fieldSlug}_dynamicField_${fieldId}`] = this.selectedFields[fieldSlug].id;
  } 
  else {
    console.warn(`No value selected for ${fieldSlug}`);
  }
});



            console.log('Submitted Data:', submittedData);

            // Submit the form data
            try {
              const response = await this.apiService.submitCustomerInfo(submittedData).toPromise();
              await this.presentAlert('Success', 'Your information has been submitted successfully.');
              this.router.navigate(['/home']);
            } catch (error) {
              console.error('Error submitting form', error);
              await this.presentAlert('Error', 'There was an error submitting your information. Please try again.');
            }
          },
        },
      ],
    });

    await alert.present();
  } else {
    await this.presentAlert('Error', `Please fill all required fields: ${missingFields.join(', ')}`);
  }
}




  private validateForm(): string[] {
    const missingFields: string[] = [];

    if (!this.selectedCountry) {
      missingFields.push('Country');

      if (this.selectedCountries[0]) {
        // Remove 'Country' from missingFields if it exists
        const index = missingFields.indexOf('Country');
        if (index > -1) {
          missingFields.splice(index, 1); // Remove the item at the found index
        }
      } else {
        // Do nothing
      }
    }

    if (!this.selectedRetailer) {
      missingFields.push('Retailer');

      if (this.selectedRetailers[0]) {
        // Remove 'Country' from missingFields if it exists
        const index = missingFields.indexOf('Retailer');
        if (index > -1) {
          missingFields.splice(index, 1); // Remove the item at the found index
        }
      } else {
        // Do nothing
      }
    }

    if (!this.selectedOutlet) {
      missingFields.push('Outlet');

      if (this.selectedoutlets[0]) {
        // Remove 'Country' from missingFields if it exists
        const index = missingFields.indexOf('Outlet');
        if (index > -1) {
          missingFields.splice(index, 1); // Remove the item at the found index
        }
      } else {
        // Do nothing
      }
    }

    if (!this.selectedCategory) {
      missingFields.push('Category');

      if (this.selectedCategories[0]) {
        // Remove 'Country' from missingFields if it exists
        const index = missingFields.indexOf('Category');
        if (index > -1) {
          missingFields.splice(index, 1); // Remove the item at the found index
        }
      } else {
        // Do nothing
      }
    }

    if (!this.selectedPreferences[0]) {
      missingFields.push('Preference');
    }
    if (!this.selectedGenders[0]) {
      missingFields.push('Gender');
    }
    if (!this.selectedAges[0]) {
      missingFields.push('Age Bracket');
    }
    if (!this.selectednationalities[0]) {
      missingFields.push('Nationality');
    }
    if (!this.selectedProducts[0]) {
      missingFields.push('Product');
    }
    if (!this.feedback || this.feedback.trim() === '') {
      missingFields.push('Feedback');
    }
    if (!this.selectedFromDate) {
      missingFields.push('Date');
    }

   // Validate dynamic fields
  // this.fields.forEach(field => {
  //   const selectedValue = this.selectedFields[field.id];
  //   if (!selectedValue) {
  //     missingFields.push(field.field_name || `Dynamic Field (ID: ${field.id})`);
  //   }
  // });

  this.fields.forEach(field => {
  const fieldSlug = field.field_slug;

  const isMultiSelectFilled =
    this.multipleSelectedOptions[fieldSlug] &&
    this.multipleSelectedOptions[fieldSlug].length > 0;

  const isSingleSelectFilled =
    this.selectedFields[fieldSlug] &&
    this.selectedFields[fieldSlug].id;

  if (!isMultiSelectFilled && !isSingleSelectFilled) {
    missingFields.push(field.field_name || `Dynamic Field (${fieldSlug})`);
  }
});

    return missingFields; 
  }


  private async presentAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header: header,
      message: message,
      buttons: [
        {
          text: 'OK',
          role: 'cancel' 
        }
      ]
    });

    await alert.present();
  }
}
