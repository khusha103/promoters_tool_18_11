// import { Component, OnInit } from '@angular/core';
// import { Router } from '@angular/router';
// import { AlertController, ModalController } from '@ionic/angular';
// import { DropdownCountryComponent } from 'src/app/components/dropdown-country/dropdown-country.component';
// import { DropdownOutletComponent } from 'src/app/components/dropdown-outlet/dropdown-outlet.component';
// import { DropdownRetailerComponent } from 'src/app/components/dropdown-retailer/dropdown-retailer.component';
// import { ApiService } from 'src/app/services/api.service';
// import { AuthService } from 'src/app/services/auth.service';
// import { UserService } from 'src/app/services/user.service';

// export interface FeedbackDetail {
//   id: string;
//   feedback_id: string;
//   product_id: string;
//   available: string;
//   open_display: string;
//   stock: string;
//   is_ranging: string;
//   attachment1_model_id: string | null;
//   attachment2_model_id: string | null;
//   attachment3_model_id: string | null;
//   product_name: string | null;
// }

// export interface Feedback {
//   id: string;
//   user_id: string;
//   store_id: string;
//   category_id: string;
//   feedback: string;
//   feedback_date: string;
//   created_on: string;
//   store_name: string;
//   retailer_name: string;
//   details: FeedbackDetail[];
// }

// @Component({
//   selector: 'app-planogram-ranging-feedback',
//   templateUrl: './planogram-ranging-feedback.page.html',
//   styleUrls: ['./planogram-ranging-feedback.page.scss'],
// })
// export class PlanogramRangingFeedbackPage implements OnInit {

//   countries: any[] = [];
//   retailers: any[] = [];
//   alloutlets: any[] = [];
//   allretailers: any[] = [];
//   useroutlet: any;
//   usercategory: any;

//   outlets: any[] = [];
//   categories: any[] = [];
//   selectedProduct: any;
//   products: any[] = [];

//   selectedCountry: any;
//   selectedRetailer: any;
//   selectedOutlet: any;
//   selectedCategory: any;
//   showupdatefeedbackbtn: boolean = false;
//   userRole: number | null = null;

//   feedbackData!: Feedback | null; // To hold the feedback data
//   errorMessage!: string | null;



//   categoryOptions = {
//     header: 'Select Category'
//   };

//   countryOptions = {
//     header: 'Select Country'
//   };

//   retailerOptions = {
//     header: 'Select Retailer'
//   };

//   storeOptions = {
//     header: 'Select Store'
//   };

//   onProductSelected(productId: string) {
//     console.log('Selected Product ID:', productId);
//     this.selectedProduct = productId;
//   }

//   constructor(private authservice:AuthService,private apiService: ApiService, private userService: UserService, private modalController: ModalController, private router: Router,private alertController: AlertController ) { }
//   usertype: any;
//   hpuserType: any;

//   ngOnInit() {
//     this.getUserRole();

//   }

//   roleId: string | null = null;
//   lang: string | null = null;
//   cid: string | null = null;
//   // errorMessage: string | null = null;
//   getUserRole() {
//     const UserId = localStorage.getItem('userId');
//     if (UserId) {
//       this.authservice.getUserRole(UserId).subscribe({
//         next: (response) => {
//           if (response.status) {
//             this.roleId = response.data.role_id; 
//             this.cid=response.data.region_id;
//             this.lang =response.data.user_lang;
//             //when get roleid then call methods
//             this.intializeapp();
//           } else {
//             this.errorMessage = response.message; // Handle error message
//           }
//         },
//         error: (error) => {
//           console.error('API Error:', error);
//           this.errorMessage = 'Failed to retrieve user role. Please try again later.';
//         }
//       });
//     }
//   }

//   intializeapp(){
//     this.fetchAllCountries();
//     this.fetchAllCategories();
//     // console.log(this.userRole);
//     // this.userRole=1;

//     this.fetchAllRetailers();
//     this.fetchAllOutlets();

//     // Check the value in local storage
//     const appSelector = localStorage.getItem('app_selection');

//     // Conditional assignment based on app-selection value
//     this.usertype = appSelector === '1' ? "1" : "2"; // Set usertype to "1" or "2"
//     // const roleId = localStorage.getItem('roleId');
//     const roleId =  this.roleId;
//     this.hpuserType = roleId;
//     this.userRole=Number(roleId);
//     // console.log("hpusertype",this.hpuserType);
//   }

//   async openCountrySelectModal() {
//     const modal = await this.modalController.create({
//       component: DropdownCountryComponent,
//       componentProps: {}
//     });

//     modal.onDidDismiss().then((result) => {
//       if (result.data) {
//         this.selectedCountry = result.data; // Get selected country from modal
//         console.log('Selected Country:', this.selectedCountry);
//         this.onCountryChange();
//       }
//     });

//     return await modal.present();
//   }

//   async openRetailerSelectModal() {
//     const modal = await this.modalController.create({
//       component: DropdownRetailerComponent,
//       componentProps: { retailers: this.retailers } // Pass the retailers array as componentProps
//     });

//     modal.onDidDismiss().then((result) => {
//       if (result.data) {
//         this.selectedRetailer = result.data;
//         console.log('Selected Retailer:', this.selectedRetailer);
//         this.onRetailerChange();
//       }
//     });

//     return await modal.present();
//   }

//   async openOutletSelectModal() {
//     const modal = await this.modalController.create({
//       component: DropdownOutletComponent,
//       componentProps: { outlets: this.outlets }
//     });

//     modal.onDidDismiss().then((result) => {
//       if (result.data) {
//         this.selectedOutlet = result.data; // Set selected outlet
//         console.log('Selected Outlet:', this.selectedOutlet);
//       }
//     });

//     return await modal.present();
//   }

//   //use in case of promoters only
//   // fetchAllOutlets() {
//   //   this.apiService.getAllOutlets().subscribe(
//   //     (response) => {
//   //       this.alloutlets = response.data;
//   //       //add check when from local storage if app-selector = 1 thne call fetchUserData() else call hp();
//   //       this.fetchUserData();
//   //     },
//   //     (error) => {
//   //       console.error('Error fetching outlets:', error);
//   //     }
//   //   );
//   // }

//   fetchAllOutlets() {
//     this.apiService.getAllOutlets().subscribe(
//       (response) => {
//         this.alloutlets = response.data;

//         // Check the value in local storage
//         const appSelector = localStorage.getItem('app_selection');
//         console.log(appSelector);

//         // Conditional call based on app-selector value
//         if (appSelector === '1') {
//           this.fetchUserData(); // Call fetchUserData if app-selector is 1
//         } else {
//           // hp user data
//           this.fetchhpUser();
//         }

//       },
//       (error) => {
//         console.error('Error fetching outlets:', error);
//       }
//     );
//   }

//   hpuserData: any = {}; // Initialize userData

//   fetchhpUser() {
//     const userIdString = localStorage.getItem('userId'); // Retrieve user ID from local storage as a string
//     if (userIdString) {
//       const userId = parseInt(userIdString); // Convert user ID to a number
//       this.apiService.getUserById(userId).subscribe(
//         response => {
//           if (response.status) {
//             this.hpuserData = response.data; // Assign the fetched data to userData
//             // console.log(this.hpuserData);
//             const countryname = response.data.countryname
//             const countryId = this.countries.find(c => c.name === countryname);
//             // console.log("countryId",countryId);

//             this.selectedCountry = countryId;
//             // console.log(this.selectedCountry);

//             if (this.selectedCountry) {
//               this.fetchRetailersByCountry(this.selectedCountry.id);
//             }

//             // console.log(this.hpuserData);
//           } else {
//             console.error('User not found');
//           }
//         },
//         error => {
//           console.error('Error fetching user data', error);
//         }
//       );
//     }
//   }

//   //use in case of promoters only
//   fetchAllRetailers() {
//     this.apiService.getAllRetailers().subscribe(
//       (response) => {
//         this.allretailers = response.data;
//         // console.log(this.allretailers);
//       },
//       (error) => {
//         console.error('Error fetching Retailers:', error);
//       }
//     );
//   }

//   fetchUserData() {
//     const userIdString = localStorage.getItem('userId');
//     const userId = userIdString ? Number(userIdString) : null;
//     // const roleId = localStorage.getItem('roleId');
//     const roleId =  this.roleId;


//     if (userId !== null) {
//       // Check if roleId is '1' (superadmin)
//       if (roleId === '1') {
//         console.log('Superadmin detected. Fetching all user data.');
//       } else {
//         this.userService.fetchUserData(userId).subscribe(
//           (response) => {
//             // Check if response is valid and has a message property
//             if (response && response.status) {
//               this.setUserData(response.data);
//             } else {
//               console.error('Failed to fetch user data:', response?.message || 'Unknown error');
//             }
//           },
//           (error) => {
//             console.error('Error fetching user data:', error);
//           }
//         );
//       }
//     } else {
//       console.warn('No user ID found in local storage.');
//     }
//   }


//   setUserData(userData: any) {
//     const retailerId = this.allretailers.find(r => r.name === userData.retailer_name); // Get retailer ID

//     if (retailerId.id) {
//       // Filter outlets based on the retailer ID
//       const outlet = this.alloutlets.find(o => o.report_name === userData.store_name && o.retailer_id === retailerId.id);
//       if (outlet) {
//         this.useroutlet = outlet.id;
//         // Outlet found with matching store name and retailer ID
//         // console.log('Found Outlet:', outlet);
//       } else {
//         // No matching outlet found
//         console.log('No matching outlet found for the given store name and retailer ID');
//       }
//     } else {
//       // No matching retailer found
//       console.log('No matching retailer found for the given retailer name');
//     }
//   }


//   fetchAllCategories() {
//     this.apiService.getAllCategories().subscribe(
//       (response) => {
//         if (response.status) { // Assuming your API response has a status field
//           this.categories = response.data; // Store the fetched categories
//         } else {
//           console.error('Failed to fetch categories:', response.message);
//         }
//       },
//       (error) => {
//         console.error('Error fetching categories:', error);
//       }
//     );
//   }

//   fetchAllCountries() {
//     this.apiService.getAllCountries().subscribe(
//       (response) => {
//         this.countries = response.data;
//       },
//       (error) => {
//         console.error('Error fetching countries:', error);
//       }
//     );
//   }



//   onCountryChange() {
//     this.retailers = [];
//     this.outlets = [];
//     this.selectedRetailer = null;
//     this.selectedOutlet = null;
//     if (this.selectedCountry) {
//       this.fetchRetailersByCountry(this.selectedCountry.id);
//     }
//   }

//   fetchRetailersByCountry(countryId: number): Promise<void> {
//     return new Promise((resolve, reject) => {
//       this.apiService.getRetailersByCountry(countryId).subscribe(
//         (response) => {
//           if (response.status) {
//             this.retailers = response.data;

//             // console.log("retailers",this.retailers);
//             if (this.retailers.length === 0) {
//               this.retailers.push({ id: null, name: 'No Retailers Found', disabled: true });
//             }
//             resolve();
//           } else {
//             this.retailers.push({ id: null, name: 'No Retailers Found', disabled: true });
//             resolve();
//           }
//         },
//         (error) => {
//           console.error('Error fetching retailers:', error);
//           this.retailers.push({ id: null, name: 'Error fetching retailers', disabled: true });
//           reject(error);
//         }
//       );
//     });
//   }

//   onRetailerChange() {
//     this.outlets = []; // Clear outlets when retailer changes
//     this.selectedOutlet = null; // Reset selected outlet
//     if (this.selectedRetailer && this.selectedRetailer.id !== null) {
//       this.fetchOutletsByRetailerAndCountry(this.selectedRetailer.id, this.selectedCountry.id);
//     }
//   }

//   fetchOutletsByRetailerAndCountry(retailerId: number, countryId: number): Promise<void> {
//     return new Promise((resolve, reject) => {
//       this.apiService.getOutletsByRetailerAndCountry(retailerId, countryId).subscribe(
//         (response) => {
//           if (response.status) {
//             this.outlets = response.data;

//             // Check if no outlets found
//             if (this.outlets.length === 0) {
//               this.outlets.push({ id: null, name: 'No Outlets Found', disabled: true });
//             }
//             resolve(); // Resolve the promise after fetching outlets
//           } else {
//             this.outlets.push({ id: null, name: 'No Outlets Found', disabled: true });
//             resolve(); // Resolve even if no outlets found
//           }
//         },
//         (error) => {
//           console.error('Error fetching outlets:', error);
//           this.outlets.push({ id: null, name: 'Error fetching outlets', disabled: true });
//           reject(error); // Reject the promise on error
//         }
//       );
//     });
//   }

//   async onCategoryChange(categoryId: number) {
//     if (categoryId) {
//       // console.log("catid on change",categoryId);

//       this.usercategory = categoryId;

//       this.fetchProductsByCategory(categoryId);
//     } else {
//       // Reset all dependent dropdowns if no category is selected
//       this.usercategory = null;
//     }
//   }

//   fetchProductsByCategory(categoryId: number) {
//     this.apiService.getProductsByCategory(categoryId).subscribe(
//       (response) => {
//         if (response.status) {
//           this.products = response.data; // Store fetched products
//         } else {
//           console.error('Failed to fetch products:', response.message);
//         }
//       },
//       (error) => {
//         console.error('Error fetching products:', error);
//         this.products = []; // Reset products if an error occurs
//       }
//     );
//   }

//   // ------------------------view ranging feedback ------------------------------------
//   fetchLatestFeedback(): void {
//     const categoryId = this.usercategory;
//     const storeId = this.useroutlet;

//     this.apiService.getLatestFeedback(categoryId, storeId).subscribe({
//       next: async (response) => {
//         if (response.status) {
//           this.feedbackData = response.data; // Assigning feedback data
//           this.errorMessage = null; // Clear any previous error messages
//           this.showupdatefeedbackbtn = true;

//           // Check if there are details available before calculating progress
//           if (this.feedbackData.details && this.feedbackData.details.length > 0) {
//             // Calculate progress percentage
//             this.calculateProgressPercentage(this.feedbackData.details);
//             this.router.navigate(['/update-ranging-feedback'], {
//               queryParams: {
//                 categoryId: categoryId,
//                 outletId: storeId
//               }
//             });
//           } else {
//             // No details available, set progress to 0
//             this.progressPercentage = 0;
//                // Show Ionic alert for no data available
//           const alert = await this.alertController.create({
//             header: 'No Data',
//             message: 'No feedback data available ',
//             buttons: ['OK']
//           });
//           await alert.present();
//           }

//           // on success navigate in below page with params
//           // [routerLink]="['/update-ranging-feedback']"
//           // [queryParams]="{ categoryId: selectedCategory?.id, outletId: selectedOutlet?.id }"
//           // On success, navigate to the desired route with query parameters
//           // this.router.navigate(['/update-ranging-feedback'], {
//           //   queryParams: {
//           //     categoryId: categoryId,
//           //     outletId: storeId
//           //   }
//           // });


//         } else {
//           this.feedbackData = null; // No feedback found
//           this.errorMessage = response.message || 'No feedback available.';
//           this.showupdatefeedbackbtn = false;

//         }
//       },
//       error: (err) => {
//         console.error(err);
//         this.errorMessage = 'An error occurred while fetching feedback.';
//         this.showupdatefeedbackbtn = false;

//       }
//     });
//   }

//   progressPercentage: number = 0; // Initialize with zero

//   // Method to calculate progress percentage
//   calculateProgressPercentage(details: any[]): void {
//     const totalEntries = details.length;
//     const openDisplayCount = details.filter(item => item.open_display === "1").length;
//     const boxDisplayCount = details.filter(item => item.available === "1").length;

//     // console.log("boxDisplayCount", boxDisplayCount);

//     // Calculate percentage with correct operator precedence
//     this.progressPercentage = totalEntries > 0 ? ((openDisplayCount + boxDisplayCount) / totalEntries) * 100 : 0;
//   }


//   fetchLatestFeedback_superadmin(): void {
//     const categoryId = this.selectedCategory.id;
//     const storeId = this.selectedOutlet.id;
//     // const categoryId = this.usercategory;
//     // const storeId = this.useroutlet;

//     this.apiService.getLatestFeedback(categoryId, storeId).subscribe({
//       next: async (response) => {
//         if (response.status) {
//           this.feedbackData = response.data;
//           this.errorMessage = null; // Clear any previous error messages
//           this.showupdatefeedbackbtn = true;

//           // Check if there are details available before calculating progress
//           if (this.feedbackData.details && this.feedbackData.details.length > 0) {
//             // Calculate progress percentage
//             this.calculateProgressPercentage(this.feedbackData.details);

//             // On success, navigate to the desired route with query parameters
//             this.router.navigate(['/update-ranging-feedback'], {
//               queryParams: {
//                 categoryId: categoryId,
//                 outletId: storeId
//               }
//             });


//           } else {
//             // No details available, set progress to 0
//             this.progressPercentage = 0;
//             //show ionic alert no data aviable for selection

//             // On success, navigate to the desired route with query parameters
//             this.router.navigate(['/update-ranging-feedback'], {
//               queryParams: {
//                 categoryId: categoryId,
//                 outletId: storeId
//               }
//             });

//             // const alert = await this.alertController.create({
//             //   header: 'No Data',
//             //   message: 'No feedback data available ',
//             //   buttons: ['OK']
//             // });
//             // await alert.present();
//           }



//         } else {
//           this.feedbackData = null; // No feedback found
//           this.errorMessage = response.message || 'No feedback available.';
//           this.showupdatefeedbackbtn = false;

//         }
//       },
//       error: (err) => {
//         console.error(err);
//         this.errorMessage = 'An error occurred while fetching feedback.';
//         this.showupdatefeedbackbtn = false;

//       }
//     });
//   }



// }

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, ModalController } from '@ionic/angular';
import { DropdownCountryComponent } from 'src/app/components/dropdown-country/dropdown-country.component';
import { DropdownOutletComponent } from 'src/app/components/dropdown-outlet/dropdown-outlet.component';
import { DropdownRetailerComponent } from 'src/app/components/dropdown-retailer/dropdown-retailer.component';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';

export interface FeedbackDetail {
  id: string;
  feedback_id: string;
  product_id: string;
  available: string;
  open_display: string;
  stock: string;
  is_ranging: string;
  attachment1_model_id: string | null;
  attachment2_model_id: string | null;
  attachment3_model_id: string | null;
  product_name: string | null;
}

export interface Feedback {
  id: string;
  user_id: string;
  store_id: string;
  category_id: string;
  feedback: string;
  feedback_date: string;
  created_on: string;
  store_name: string;
  retailer_name: string;
  details: FeedbackDetail[];
}

@Component({
  selector: 'app-planogram-ranging-feedback',
  templateUrl: './planogram-ranging-feedback.page.html',
  styleUrls: ['./planogram-ranging-feedback.page.scss'],
})
export class PlanogramRangingFeedbackPage implements OnInit {

  countries: any[] = [];
  retailers: any[] = [];
  alloutlets: any[] = [];
  allretailers: any[] = [];
  useroutlet: any;
  usercategory: any;

  outlets: any[] = [];
  categories: any[] = [];
  selectedProduct: any;
  products: any[] = [];

  selectedCountry: any;
  selectedRetailer: any;
  selectedOutlet: any;
  selectedCategory: any;
  showupdatefeedbackbtn: boolean = false;
  userRole: number | null = null;

  feedbackData!: Feedback | null; // To hold the feedback data
  errorMessage!: string | null;



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

  onProductSelected(productId: string) {
    console.log('Selected Product ID:', productId);
    this.selectedProduct = productId;
  }

  constructor(private authservice:AuthService,private apiService: ApiService, private userService: UserService, private modalController: ModalController, private router: Router,private alertController: AlertController ) { }
  usertype: any;
  hpuserType: any;

  ngOnInit() {
    this.getUserRole();
  }

  ionViewWillEnter() {
    this.getUserRole();
  }

  roleId: string | null = null;
  lang: string | null = null;
  cid: string | null = null;
  // errorMessage: string | null = null;
  getUserRole() {
    const UserId = localStorage.getItem('userId');
    if (UserId) {
      this.authservice.getUserRole(UserId).subscribe({
        next: (response) => {
          if (response.status) {
            this.roleId = response.data.role_id; 
            this.cid=response.data.region_id;
            this.lang =response.data.user_lang;
            this.userRole = response.data.role_id; 
            //when get roleid then call methods
            this.intializeapp();
          } else {
            this.errorMessage = response.message; // Handle error message
          }
        },
        error: (error) => {
          console.error('API Error:', error);
          this.errorMessage = 'Failed to retrieve user role. Please try again later.';
        }
      });
    }
  }

  intializeapp(){
    this.fetchAllCountries();
    this.fetchAllCategories();
    // console.log(this.userRole);
    // this.userRole=1;

    this.fetchAllRetailers();
    this.fetchAllOutlets();

    // Check the value in local storage
    const appSelector = localStorage.getItem('app_selection');

    // Conditional assignment based on app-selection value
    this.usertype = appSelector === '1' ? "1" : "2"; // Set usertype to "1" or "2"
    // const roleId = localStorage.getItem('roleId');
    const roleId =  this.roleId;
    this.hpuserType = roleId;
    this.userRole=Number(roleId);
    // console.log("hpusertype",this.hpuserType);
  }

  async openCountrySelectModal() {
    const modal = await this.modalController.create({
      component: DropdownCountryComponent,
      componentProps: {}
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
  // fetchAllOutlets() {
  //   this.apiService.getAllOutlets().subscribe(
  //     (response) => {
  //       this.alloutlets = response.data;
  //       //add check when from local storage if app-selector = 1 thne call fetchUserData() else call hp();
  //       this.fetchUserData();
  //     },
  //     (error) => {
  //       console.error('Error fetching outlets:', error);
  //     }
  //   );
  // }

  fetchAllOutlets() {
    this.apiService.getAllOutlets().subscribe(
      (response) => {
        this.alloutlets = response.data;

        // Check the value in local storage
        const appSelector = localStorage.getItem('app_selection');
        console.log(appSelector);

        // Conditional call based on app-selector value
        if (appSelector === '1') {
          this.fetchUserData(); // Call fetchUserData if app-selector is 1
        } else {
          // hp user data
          this.fetchhpUser();
        }

      },
      (error) => {
        console.error('Error fetching outlets:', error);
      }
    );
  }

  hpuserData: any = {}; // Initialize userData
  cnt_data:any;

  fetchhpUser() {
    const userIdString = localStorage.getItem('userId'); // Retrieve user ID from local storage as a string
    if (userIdString) {
      const userId = parseInt(userIdString); // Convert user ID to a number
      this.apiService.getUserById(userId).subscribe(
        response => {
          if (response.status) {
            this.hpuserData = response.data; // Assign the fetched data to userData
            // console.log(this.hpuserData);
            const countryname = response.data.countryname
            // const countryId = this.countries.find(c => c.name === countryname);
            // // console.log("countryId",countryId);

            // this.selectedCountry = countryId;
            // console.log(this.selectedCountry);

            //now preselcted hp user country from multiple countries
            
            this.selectedCountry = Number(localStorage.getItem('cnt_wip'));
            console.log(this.selectedCountry);


            this.apiService.getCountryData(this.selectedCountry).subscribe(
              (response) => {
                this.selectedCountry = response['0'];
                console.log(this.cnt_data);
                console.log('Country Data:', this.countries);

                if (this.selectedCountry) {
                  this.fetchRetailersByCountry(this.selectedCountry.id);
                }
    
              },
              (error) => {
                console.error('Error fetching country data:', error);
              }
            );

           
            // console.log(this.hpuserData);
          } else {
            console.error('User not found');
          }
        },
        error => {
          console.error('Error fetching user data', error);
        }
      );
    }
  }

  

  //use in case of promoters only
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

  fetchUserData() {
    const userIdString = localStorage.getItem('userId');
    const userId = userIdString ? Number(userIdString) : null;
    // const roleId = localStorage.getItem('roleId');
    const roleId =  this.roleId;


    if (userId !== null) {
      // Check if roleId is '1' (superadmin)
      if (roleId === '1') {
        console.log('Superadmin detected. Fetching all user data.');
      } else {
        this.userService.fetchUserData(userId).subscribe(
          (response) => {
            // Check if response is valid and has a message property
            if (response && response.status) {
              this.setUserData(response.data);
            } else {
              console.error('Failed to fetch user data:', response?.message || 'Unknown error');
            }
          },
          (error) => {
            console.error('Error fetching user data:', error);
          }
        );
      }
    } else {
      console.warn('No user ID found in local storage.');
    }
  }


  setUserData(userData: any) {
    const retailerId = this.allretailers.find(r => r.name === userData.retailer_name); // Get retailer ID

    if (retailerId.id) {
      // Filter outlets based on the retailer ID
      const outlet = this.alloutlets.find(o => o.report_name === userData.store_name && o.retailer_id === retailerId.id);
      if (outlet) {
        this.useroutlet = outlet.id;
        // Outlet found with matching store name and retailer ID
        // console.log('Found Outlet:', outlet);
      } else {
        // No matching outlet found
        console.log('No matching outlet found for the given store name and retailer ID');
      }
    } else {
      // No matching retailer found
      console.log('No matching retailer found for the given retailer name');
    }
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
    this.apiService.getAllCountries().subscribe(
      (response) => {
        this.countries = response.data;
      },
      (error) => {
        console.error('Error fetching countries:', error);
      }
    );
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

      this.fetchProductsByCategory(categoryId);
    } else {
      // Reset all dependent dropdowns if no category is selected
      this.usercategory = null;
    }
  }

  fetchProductsByCategory(categoryId: number) {
    this.apiService.getProductsByCategory(categoryId).subscribe(
      (response) => {
        if (response.status) {
          this.products = response.data; // Store fetched products
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

  // ------------------------view ranging feedback ------------------------------------
  fetchLatestFeedback(): void {
    const categoryId = this.usercategory;
    const storeId = this.useroutlet;

    this.apiService.getLatestFeedback(categoryId, storeId).subscribe({
      next: async (response) => {
        if (response.status) {
          this.feedbackData = response.data; // Assigning feedback data
          this.errorMessage = null; // Clear any previous error messages
          this.showupdatefeedbackbtn = true;

          // Check if there are details available before calculating progress
          // if (this.feedbackData.details && this.feedbackData.details.length > 0) {
          if (this.feedbackData.details) {
            // Calculate progress percentage
            this.calculateProgressPercentage(this.feedbackData.details);
            this.router.navigate(['/update-ranging-feedback'], {
              queryParams: {
                categoryId: categoryId,
                outletId: storeId
              }
            });
          } else {
            // No details available, set progress to 0
            this.progressPercentage = 0;
               // Show Ionic alert for no data available
          const alert = await this.alertController.create({
            header: 'No Data',
            message: 'No feedback data available ',
            buttons: ['OK']
          });
          await alert.present();
          }

          // on success navigate in below page with params
          // [routerLink]="['/update-ranging-feedback']"
          // [queryParams]="{ categoryId: selectedCategory?.id, outletId: selectedOutlet?.id }"
          // On success, navigate to the desired route with query parameters
          // this.router.navigate(['/update-ranging-feedback'], {
          //   queryParams: {
          //     categoryId: categoryId,
          //     outletId: storeId
          //   }
          // });


        } else {
          this.feedbackData = null; // No feedback found
          this.errorMessage = response.message || 'No feedback available.';
          this.showupdatefeedbackbtn = false;

        }
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = 'An error occurred while fetching feedback.';
        this.showupdatefeedbackbtn = false;

      }
    });
  }

  progressPercentage: number = 0; // Initialize with zero

  // Method to calculate progress percentage
  calculateProgressPercentage(details: any[]): void {
    const totalEntries = details.length;
    const openDisplayCount = details.filter(item => item.open_display === "1").length;
    const boxDisplayCount = details.filter(item => item.available === "1").length;

    // console.log("boxDisplayCount", boxDisplayCount);

    // Calculate percentage with correct operator precedence
    this.progressPercentage = totalEntries > 0 ? ((openDisplayCount + boxDisplayCount) / totalEntries) * 100 : 0;
  }


  fetchLatestFeedback_superadmin(): void {
    const categoryId = this.selectedCategory.id;
    const storeId = this.selectedOutlet.id;
    // const categoryId = this.usercategory;
    // const storeId = this.useroutlet;

    this.apiService.getLatestFeedback(categoryId, storeId).subscribe({
      next: async (response) => {
        if (response.status) {
          this.feedbackData = response.data;
          this.errorMessage = null; // Clear any previous error messages
          this.showupdatefeedbackbtn = true;

          // Check if there are details available before calculating progress
          if (this.feedbackData.details && this.feedbackData.details.length > 0) {
            // Calculate progress percentage
            this.calculateProgressPercentage(this.feedbackData.details);

            // On success, navigate to the desired route with query parameters
            this.router.navigate(['/update-ranging-feedback'], {
              queryParams: {
                categoryId: categoryId,
                outletId: storeId
              }
            });


          } else {
            // No details available, set progress to 0
            this.progressPercentage = 0;
            //show ionic alert no data aviable for selection

            // On success, navigate to the desired route with query parameters
            this.router.navigate(['/update-ranging-feedback'], {
              queryParams: {
                categoryId: categoryId,
                outletId: storeId
              }
            });

            // const alert = await this.alertController.create({
            //   header: 'No Data',
            //   message: 'No feedback data available ',
            //   buttons: ['OK']
            // });
            // await alert.present();
          }



        } else {
          this.feedbackData = null; // No feedback found
          this.errorMessage = response.message || 'No feedback available.';
          this.showupdatefeedbackbtn = false;

        }
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = 'An error occurred while fetching feedback.';
        this.showupdatefeedbackbtn = false;

      }
    });
  }



}

