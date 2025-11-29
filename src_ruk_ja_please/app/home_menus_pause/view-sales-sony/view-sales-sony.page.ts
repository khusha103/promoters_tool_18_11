import { Component, OnInit, ViewChild } from '@angular/core';
import { AlertController, IonPopover } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';
import { environment } from 'src/environments/environment';

export interface Sale {
  date: string;
  model: string;
  price: string; 
  quantity: string; 
  total: string; 
}

@Component({
  selector: 'app-view-sales-sony',
  templateUrl: './view-sales-sony.page.html',
  styleUrls: ['./view-sales-sony.page.scss'],
})
export class ViewSalesSonyPage implements OnInit {

  @ViewChild('fromPopover') fromPopover?: IonPopover;
  @ViewChild('toPopover') toPopover?: IonPopover;

  isFromPopoverOpen: boolean = false;
  isToPopoverOpen: boolean = false;
  isToDisabledownload: boolean = true;

  
  salesData: Sale[] = []; 

  pic_countries: any[] = [];
  countries: any[] = [];
  retailers: any[] = [];
  alloutlets: any[] = [];
  allretailers: any[] = [];
  useroutlet: any;
  usercategory: any;
  outlets: any[] = [];
  categories: any[] = [];
  promoters: any[] = [];

  products: any[] = [];

  selectedProduct: any;
  selectedCountry: any;
  selectedRetailer: any;
  selectedOutlet: any;
  selectedCategory: any;
  selectedPromoter: any;
  selectedFromDate: string | null = null;
  selectedToDate: string | null = null;

  categoryOptions = {
    header: 'Select Category'
  };

  promoterOptions = {
    header: 'Select Promoter'
  };

  brandsOptions = {
    header: 'Select Brand'
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

  


  onFromDateChange(event: any) {
    // Get the full date from the event
    const fullDate = new Date(event.detail.value);
    
    // Convert to 'YYYY-MM-DD' format
    const year = fullDate.getFullYear();
    const month = String(fullDate.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
    const day = String(fullDate.getDate()).padStart(2, '0');

    this.selectedFromDate = `${year}-${month}-${day}`;
    this.fromPopover?.dismiss();

    // // Log the formatted date
    // console.log(this.selectedFromDate); // Should log '2024-10-01'
}

onToDateChange(event: any) {
  // Get the full date from the event
  const fullDate = new Date(event.detail.value);
  
  // Convert to 'YYYY-MM-DD' format
  const year = fullDate.getFullYear();
  const month = String(fullDate.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
  const day = String(fullDate.getDate()).padStart(2, '0');
  this.selectedToDate = `${year}-${month}-${day}`;
  this.toPopover?.dismiss();
  
}

  quantityTotal: number = 0;
  total: number = 0;

  isAdminFormValid(): boolean {
    return !!(this.selectedProduct &&
      this.selectedCountry &&
      this.selectedRetailer &&
      this.selectedOutlet &&
      this.selectedCategory &&
      this.selectedFromDate &&
      this.selectedToDate);
  }

  isPromoterFormValid(): boolean {
    return !!(
      
      this.selectedPromoter &&
      this.selectedCategory &&
      this.selectedFromDate &&
      this.selectedToDate);
  }
  // showupdatefeedbackbtn: boolean = false;
  userRole: number | null = null;

  // feedbackData!: Feedback | null; // To hold the feedback data
  errorMessage!: string | null;


  constructor(private apiService: ApiService, private userService: UserService, private alertController: AlertController,private authservice:AuthService) { }

  ngOnInit() {
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
              this.userRole = response.data.role_id; 
              console.log(this.roleId);
              this.cid=response.data.region_id;
              this.lang =response.data.user_lang;
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
    this.fetchAllRetailers();
    this.fetchAllOutlets();
  }



  //use in case of promoters only
  fetchPromoters() {
    console.log(this.useroutlet);
    this.useroutlet = 0;
    this.apiService.getPromoters(this.useroutlet).subscribe(
      // this.apiService.getPromoters('0').subscribe(
      (response) => {
        if(response.status){
          this.promoters = response.data;
          console.log(this.promoters);
        }
      
      },
      (error) => {
        console.error('Error fetching promoters:', error);
      }
    );
  }

  //use in case of promoters only
  fetchAllOutlets() {
    this.apiService.getAllOutlets().subscribe(
      (response) => {
        this.alloutlets = response.data;
        // console.log(this.alloutlets);
        this.fetchUserData();
      },
      (error) => {
        console.error('Error fetching outlets:', error);
      }
    );
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
    const roleId = this.roleId;

    if (userId !== null) {
        // Check if roleId is '1' (superadmin)
        if (roleId === '1') {
            console.log('Superadmin detected');
        } else if (roleId === '4') {
            this.userService.fetchUsertableData(userId).subscribe(
                (response) => {
                    // Check if response is valid and has a message property
                    if (response && response.status) {
                        // this.setUserData(response.data);
                        this.handleMultiRegionId(response.data.multi_region_id);
                    } else {
                        console.error('Failed to fetch user data:', response?.message || 'Unknown error');
                    }
                },
                (error) => {
                    console.error('Error fetching user data:', error);
                }
            );
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
        this.fetchPromoters();
      } else {
        console.log('No matching outlet found for the given store name and retailer ID');
      }
    } else {
      console.log('No matching retailer found for the given retailer name');
    }
  }


  handleMultiRegionId(multiRegionIds: string) {
    // Split the multi_region_id string into an array
    const regionIds = multiRegionIds.split(',').map(id => id.trim());
    console.log(regionIds);
    
    // Fetch all countries
    this.fetchAllCountries().then(() => {
        // Filter countries based on multi_region_ids
        this.pic_countries = this.countries.filter(country => regionIds.includes(country.id.toString()));
        console.log(this.pic_countries);
        
        if (this.pic_countries.length > 0) {
            console.log('Filtered countries based on multi_region_id:', this.pic_countries);
        } else {
            console.warn('No countries found for the given multi_region_id');
        }
    });
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
          console.log(this.products);
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

  onProductSelected(productId: any) {
    console.log('Selected Product ID:', productId);
    this.selectedProduct = productId.id;
  }

  // ------------------------view Sales api------------------------------------
//   loadSalesData() {
//     const countryId = this.selectedCountry?.id || 0; 
//     const retailerId = this.selectedRetailer?.id || 0; 
//     const storeId = this.selectedOutlet?.id || 0; 
//     const categoryId = this.selectedCategory?.id || 0; 
//     const modelId = this.selectedProduct || 0; 
//     // const modelId = 745; 
//     const promoterId = this.selectedPromoter?.id || 0; 
//     const fromDate = this.selectedFromDate || '0'; 
//     const toDate = this.selectedToDate || '0'; 

//     console.log(modelId);

//     this.apiService.fetchSalesData(countryId, retailerId, storeId, categoryId, modelId, promoterId, fromDate, toDate)
//       .subscribe(
//         (response) => {
//           if (response.status) {
//             // if (response.data.length > 0) {
//               if (response.data) {
//               // console.log("inside true");
//               this.salesData = response.data.sales; 
//               console.log(this.salesData);
//               this.quantityTotal = response.data.quantityTotal; // Assign quantity total
//               this.total = response.data.total; // Assign total amount
//               this.errorMessage = ''; 
//               this.isToDisabledownload = false;
//             } else {
//               this.errorMessage = 'No sales data found for the selected criteria.'; // Set error message if no data
//               this.isToDisabledownload = true;
//               this.salesData = []; // Clear sales data if none found
//             }
//           } else {
//             this.errorMessage = response.message; // Handle other cases with a message from the response
//           }
//         },
//         (error) => {
//           console.error('Error fetching sales data:', error);
//           this.errorMessage = 'Failed to fetch sales data. Please try again later.';
//         }
//       );
// }

async loadSalesData() {
  const countryId = this.selectedCountry?.id || 0; 
  const retailerId = this.selectedRetailer?.id || 0; 
  const storeId = this.selectedOutlet?.id || 0; 
  const categoryId = this.selectedCategory?.id || 0; 
  const modelId = this.selectedProduct || 0; 
  const promoterId = this.selectedPromoter?.id || 0; 
  const fromDate = this.selectedFromDate || '0'; 
  const toDate = this.selectedToDate || '0'; 

  console.log(modelId);

  this.apiService.fetchSalesData(countryId, retailerId, storeId, categoryId, modelId, promoterId, fromDate, toDate)
    .subscribe(
      async (response) => {
        // Check if the response is valid
        if (response && response.status) {
          // Check if data exists and is an array
          if (Array.isArray(response.data.sales) && response.data.sales.length > 0) {
            this.salesData = response.data.sales; 
            console.log(this.salesData);
            this.quantityTotal = response.data.quantityTotal || 0; // Assign quantity total
            this.total = response.data.total || 0; // Assign total amount
            this.isToDisabledownload = false;
          } else {
            // Handle case where no sales data is found
            await this.showAlert('No sales data found for the selected criteria.'); // Show alert
            this.isToDisabledownload = true;
            this.salesData = []; // Clear sales data if none found
          }
        } else {
          // Handle case where response status is false
          await this.showAlert(response?.message || 'An unexpected error occurred.'); // Show alert with default message
          this.isToDisabledownload = true;
          this.salesData = []; // Clear sales data on error
        }
      },
      async (error) => {
        console.error('Error fetching sales data:', error);
        await this.showAlert('Failed to fetch sales data. Please try again later.'); // Show alert on error
        this.isToDisabledownload = true;
        this.salesData = []; // Clear sales data on error
      }
    );
}

// Method to show alerts using AlertController
async showAlert(message: string) {
  const alert = await this.alertController.create({
    header: 'Alert',
    message: message,
    buttons: ['OK'],
  });

  await alert.present();
}
  // downloadSalesData() {
  //   const countryId = this.selectedCountry.id || 0; 
  //   const retailerId = this.selectedRetailer.id || 0; 
  //   const storeId = this.selectedOutlet.id || 0; 
  //   const categoryId = this.selectedCategory?.id || 0; 
  //   // const modelId = this.selectedProduct.id || 0; 
  //   const modelId = 745; 
  //   const promoterId = this.selectedPromoter?.id || 2890; 
  //   const fromDate = this.selectedFromDate || '0'; 
  //   const toDate = this.selectedToDate || '0'; 

  //   this.apiService.downloadSalesData(countryId, retailerId, storeId, categoryId, modelId, promoterId, fromDate, toDate)
  //     .subscribe(
  //       (response) => {
  //         // Create a new Blob object using the response data of the onload object
  //         const blob = new Blob([response], { type: 'application/vnd.ms-excel' });
  //         // Create a link element
  //         const link = document.createElement('a');
  //         // Set link's href to point to the Blob URL
  //         link.href = window.URL.createObjectURL(blob);
  //         // Set the download attribute with a filename
  //         link.download = `SonySales_${new Date().toISOString().split('T')[0]}.xls`;
  //         // Append link to body
  //         document.body.appendChild(link);
  //         // Trigger click on link to download
  //         link.click();
  //         // Clean up and remove the link
  //         document.body.removeChild(link);
  //       },
  //       (error) => {
  //         console.error('Error downloading sales data:', error);
  //       }
  //     );
  // }


 // New method to open the URL in the browser
downloadSalesData() {
  const countryId = this.selectedCountry?.id || 0; 
  const retailerId = this.selectedRetailer?.id || 0; 
  const storeId = this.selectedOutlet?.id || 0; 
  const categoryId = this.selectedCategory?.id || 0; 
  const modelId = this.selectedProduct?.id || 0; 
  // const modelId = 745; 
  const promoterId = this.selectedPromoter?.id || 0; 
  const fromDate = this.selectedFromDate || '0'; 
  const toDate = this.selectedToDate || '0'; 

  // Construct the URL with parameters
  // const url = `https://ekarigartech.com/happy_pta/App_api/ownsales_xls/${countryId}/${retailerId}/${storeId}/${categoryId}/${modelId}/${promoterId}/${fromDate}/${toDate}`;

   // Construct the URL dynamically using the environment variable
   const url = `${environment.apiBaseUrl}/App_api/ownsales_xls/${countryId}/${retailerId}/${storeId}/${categoryId}/${modelId}/${promoterId}/${fromDate}/${toDate}`;
  

  // Open the URL in a new browser tab
  window.open(url, '_blank');
}

}
