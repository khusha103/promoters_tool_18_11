import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, ModalController, IonicModule } from '@ionic/angular';
// import { CountryDropdownComponent } from 'src/app/components/country-dropdown/country-dropdown.component';
import { DropdownCountryComponent } from 'src/app/components/dropdown-country/dropdown-country.component';
import { DropdownOutletComponent } from 'src/app/components/dropdown-outlet/dropdown-outlet.component';
import { DropdownRetailerComponent } from 'src/app/components/dropdown-retailer/dropdown-retailer.component';
import { ApiService } from 'src/app/services/api.service';


@Component({
  selector: 'app-daily-vmd-checklist',
  templateUrl: './daily-promoter-checklist.page.html',
  styleUrls: ['./daily-promoter-checklist.page.scss'],
 
})
export class DailyPromoterChecklistPage implements OnInit {
  countries: any[] = [];
  retailers: any[] = [];
  alloutlets: any[] = [];
  allretailers: any[] = [];
  useroutlet: any;
  usercategory: any;
  outlets: any[] = [];
  categories: any[] = [];

  selectedCountry: any;
  selectedRetailer: any;
  selectedOutlet: any;
  selectedCategory: any;

  categoryOptions = {
    header: 'Select Category'
  };

  countryOptions = {
    header: 'Select Country'
  };

  retailerOptions = {
    header: 'Select Retailer'
  };

  storeOptions = {
    header: 'Select Store'
  };

  

  constructor(private apiService:ApiService,private router: Router,private alertController:AlertController,private modalController:ModalController) { }

  ngOnInit() {
    this.fetchAllCountries();
    this.fetchAllCategories();
    this.fetchAllRetailers();
    this.fetchAllOutlets();
  }

  ionViewDidEnter() {
    this.fetchAllCountries();
    this.fetchAllCategories();
    this.fetchAllRetailers();
    this.fetchAllOutlets();
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
        this.onRetailerChange();
      }
    });
  
    return await modal.present();
  }
  
  async openOutletSelectModal() {
    const modal = await this.modalController.create({
      component: DropdownOutletComponent,
      componentProps: { outlets: this.outlets }
    });
  
    modal.onDidDismiss().then((result) => {
      if (result.data) {
        this.selectedOutlet = result.data; // Set selected outlet
        console.log('Selected Outlet:', this.selectedOutlet);
      }
    });
  
    return await modal.present();
  }
  
  

  //use in case of promoters only
  fetchAllOutlets() {
    this.apiService.getAllOutlets().subscribe(
      (response) => {
        this.alloutlets = response.data;
        // console.log(this.alloutlets);
        // this.fetchUserData();
      },
      (error) => {
        console.error('Error fetching outlets:', error);
      }
    );
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
    this.outlets = [];
    this.selectedRetailer = null;
    this.selectedOutlet = null;
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

  onRetailerChange() {
    this.outlets = []; // Clear outlets when retailer changes
    this.selectedOutlet = null; // Reset selected outlet
    if (this.selectedRetailer && this.selectedRetailer.id !== null) {
      this.fetchOutletsByRetailerAndCountry(this.selectedRetailer.id, this.selectedCountry.id);
    }
  }

  fetchOutletsByRetailerAndCountry(retailerId: number, countryId: number): Promise<void> {
    return new Promise((resolve, reject) => {
      this.apiService.getOutletsByRetailerAndCountry(retailerId, countryId).subscribe(
        (response) => {
          if (response.status) {
            this.outlets = response.data;

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


  async onCategoryChange(categoryId: number) {
    if (categoryId) {
      // console.log("catid on change",categoryId);

      this.usercategory = categoryId;
      this.fetchPIC();

      
    } else {
      // Reset all dependent dropdowns if no category is selected
      this.usercategory = null;
    }
  }
  errorMessage: string | undefined;
  pic: any;
  fetchPIC(){
    const storeId = this.selectedOutlet.id; 
    // const storeId = 570; 

    console.log("storeId",storeId);
    

    this.apiService.getOutletPic(storeId).subscribe(
      (response) => {
        // this.outletData = response;
        console.log(response);
        this.pic = response;
       
      },
      (error) => {
        this.errorMessage = 'An error occurred while fetching data';
        console.log('Error:', error);
       
      }
    );
  }

  async proceed() {
    const categoryId = this.selectedCategory?.id;
    const countryId = this.selectedCountry?.id;
    const storeId = this.selectedOutlet?.id;

    if (!categoryId) {
        await this.showAlert('Missing Category', 'Please select a category.');
    } else if (!countryId) {
        await this.showAlert('Missing Country', 'Please select a country.');
    } else if (!storeId) {
        await this.showAlert('Missing Store', 'Please select a store.');
    } else {
        // Navigate to the desired page with query parameters
        this.router.navigate(['/daily-promoter-checklist-ques'], { 
            queryParams: { categoryId, countryId, storeId }
        });
    }
}

private async showAlert(header: string, message: string) {
    const alert = await this.alertController.create({
        header: header,
        message: message,
        buttons: ['OK'],
    });

    await alert.present();
}

}
