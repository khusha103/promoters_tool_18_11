import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, ModalController } from '@ionic/angular';
import { DropdownCountryComponent } from 'src/app/components/dropdown-country/dropdown-country.component';
import { DropdownRetailerComponent } from 'src/app/components/dropdown-retailer/dropdown-retailer.component';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-register-new-store',
  templateUrl: './register-new-store.page.html',
  styleUrls: ['./register-new-store.page.scss'],
})
export class RegisterNewStorePage implements OnInit {
  countries: any[] = [];
  retailers: any[] = [];
  allretailers: any[] = [];
  categories: any[] = [];
  selectedCountry: any;
  selectedRetailer: any;
  public selectedCategories: string[] = [];
  
  
  repoName: string = ""; 
  storeCode: string = ""; 
  frequency: number | undefined; 
  selectedClass!: string; 

  constructor(private apiService: ApiService, private router: Router,private alertController: AlertController,private modalController:ModalController) { }

  ngOnInit() {
    this.fetchAllCountries();
    this.fetchAllCategories();
    this.fetchAllRetailers();
    this.generateStoreCode();
  }


  async openCountrySelectModal() {
    const modal = await this.modalController.create({
      component: DropdownCountryComponent,
      componentProps: {  }
    });
  
    modal.onDidDismiss().then((result) => {
      if (result.data) {
        this.selectedCountry = result.data; // Get selected country from modal
        console.log('Selected Country:', this.selectedCountry);
        this.onCountryChange();
      }
    });
  
    return await modal.present();
  }

  async openRetailerSelectModal() {
    const modal = await this.modalController.create({
      component: DropdownRetailerComponent,
      componentProps: { retailers: this.retailers } // Pass the retailers array as componentProps
    });
  
    modal.onDidDismiss().then((result) => {
      if (result.data) {
        this.selectedRetailer = result.data; 
        console.log('Selected Retailer:', this.selectedRetailer);
        // this.onRetailerChange();
      }
    });
  
    return await modal.present();
  }
  // Method to generate store code
  generateStoreCode() {
    this.apiService.getGeneratedStoreCode().subscribe(
      (response) => {
        if (!response.error) {
          this.storeCode = response.store_code; // Assuming your API returns store_code in response
          console.log('Generated Store Code:', this.storeCode);
        } else {
          console.error('Error generating store code:', response.message);
        }
      },
      (error) => {
        console.error('API error while generating store code:', error);
      }
    );
  }

  categoryOptions = {
    header: 'Select Category'
  };

  countryOptions = {
    header: 'Select Country'
  };

  retailerOptions = {
    header: 'Select Retailer'
  };

  classOptions = {
    header: 'Select Class'
  };

  classes = [
    {
      id: 1,
      name: "A",
    },
    {
      id: 2,
      name: "B",
    },
    {
      id: 3,
      name: "C",
    }
  ];

// Method to log selected categories
logSelection() {
  console.log('Selected Categories:', this.selectedCategories);
}
  fetchAllRetailers() {
    this.apiService.getAllRetailers().subscribe(
      (response) => {
        this.allretailers = response.data;
        // console.log(this.allretailers);
      },
      (error) => {
        console.error('Error fetching Retailers:', error);
      }
    );
  }


  fetchAllCategories() {
    this.apiService.getAllCategories().subscribe(
      (response) => {
        if (response.status) { // Assuming your API response has a status field
          this.categories = response.data; // Store the fetched categories
          console.log(this.categories);
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
    return new Promise((resolve, reject) => {
        this.apiService.getAllCountries().subscribe(
            (response) => {
                this.countries = response.data;
                resolve(this.countries);
            },
            (error) => {
                console.error('Error fetching countries:', error);
                reject(error);
            }
        );
    });
}

  onCountryChange() {
    this.retailers = [];
    // this.outlets = [];
    this.selectedRetailer = null;
    // this.selectedOutlet = null;
    if (this.selectedCountry) {
      this.fetchRetailersByCountry(this.selectedCountry.id);
    }
  }

  fetchRetailersByCountry(countryId: number): Promise<void> {
    return new Promise((resolve, reject) => {
      this.apiService.getRetailersByCountry(countryId).subscribe(
        (response) => {
          if (response.status) {
            this.retailers = response.data;
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

 onCategoryChange(categoryId: string, isChecked: boolean) {
  if (isChecked) {
    if (!this.selectedCategories.includes(categoryId)) {
      this.selectedCategories.push(categoryId);
    }
  } else {
    const index = this.selectedCategories.indexOf(categoryId);
    if (index > -1) {
      this.selectedCategories.splice(index, 1);
    }
  }
}


// submitForm() {
//   const payload = {
//       categories: this.selectedCategories.filter(id => id !== null && id !== undefined), // Ensure no null or undefined values
//       code: this.storeCode,
//       repo_name: this.repoName, // Use the bound input value here
//       country: this.selectedCountry?.id,
//       retailer: this.selectedRetailer?.id,
//       store_class: this.selectedClass, // Use the bound select value here
//       frequency: this.frequency
//   };

//   console.log("payload",payload);

//   this.apiService.submitStoreData(payload).subscribe(
//       (response) => {
//           console.log('Store registered successfully:', response);
//           // Navigate or show success message
//       },
//       (error) => {
//           console.error('Error registering store:', error);
//           // Handle error
//       }
//   );
// }

    
// async presentSuccessAlert() {
//   const alert = await this.alertController.create({
//     header: 'Success',
//     message: 'Store registered successfully!',
//     buttons: ['OK']
//   });

//   await alert.present();
// }

// async presentConfirmationAlert() {
//   const alert = await this.alertController.create({
//     header: 'Confirm Submission',
//     message: 'Are you sure you want to submit this store registration?',
//     buttons: [
//       {
//         text: 'Cancel',
//         role: 'cancel',
//         cssClass: 'secondary',
//         handler: () => {
//           console.log('Submission canceled');
//         }
//       },
//       {
//         text: 'Submit',
//         handler: () => {
//           this.submitForm(); // Call submitForm if confirmed
//         }
//       }
//     ]
//   });

//   await alert.present();
// }


async presentConfirmationAlert() {
  const alert = await this.alertController.create({
    header: 'Confirm Submission',
    message: 'Are you sure you want to submit this store registration?',
    buttons: [
      {
        text: 'Cancel',
        role: 'cancel',
        cssClass: 'secondary',
        handler: () => {
          console.log('Submission canceled');
        }
      },
      {
        text: 'Submit',
        handler: () => {
          this.submitStoreData(); // Call actual submit logic if confirmed
        }
      }
    ]
  });

  await alert.present();
}

async submitForm() {
  this.presentConfirmationAlert(); // Show confirmation alert
}

async submitStoreData() {
  const payload = {
    categories: this.selectedCategories.filter(id => id !== null && id !== undefined),
    code: this.storeCode,
    repo_name: this.repoName,
    country: this.selectedCountry?.id,
    retailer: this.selectedRetailer?.id,
    store_class: this.selectedClass,
    frequency: this.frequency
  };

  console.log("payload", payload);

  this.apiService.submitStoreData(payload).subscribe(
    async (response) => {
      console.log('Store registered successfully:', response);
      await this.presentSuccessAlert(); // Show success alert
      this.resetForm(); // Reset form after successful submission
    },
    async (error) => {
      console.error('Error registering store:', error);
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'There was an error registering the store. Please try again.',
        buttons: ['OK']
      });
      await alert.present();
    }
  );
}

async presentSuccessAlert() {
  const alert = await this.alertController.create({
    header: 'Success',
    message: 'Store registered successfully!',
    buttons: ['OK']
  });
  
  await alert.present();
}

resetForm() {
  // Reset form fields here
  this.repoName = '';
  this.storeCode = '';
  this.frequency = undefined;
  this.selectedClass = '';
  this.selectedCategories = [];
  this.selectedCountry = null;
  this.selectedRetailer = null;
  
  // Optionally reset retailers if needed:
  //this.retailers = [];
}

}
