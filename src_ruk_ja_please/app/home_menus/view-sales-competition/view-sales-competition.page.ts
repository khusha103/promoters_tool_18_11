


// import { Component, OnInit, ViewChild } from '@angular/core';
// import { AlertController, IonPopover } from '@ionic/angular';
// import { ApiService } from 'src/app/services/api.service';
// import { AuthService } from 'src/app/services/auth.service';
// import { UserService } from 'src/app/services/user.service';

// @Component({
//   selector: 'app-view-sales-competition',
//   templateUrl: './view-sales-competition.page.html',
//   styleUrls: ['./view-sales-competition.page.scss'],
// })
// export class ViewSalesCompetitionPage implements OnInit {

//   @ViewChild('fromPopover') fromPopover?: IonPopover;
//   @ViewChild('toPopover') toPopover?: IonPopover;

//   isFromPopoverOpen: boolean = false;
//   isToPopoverOpen: boolean = false;
//   brands: { brand: string }[] = []; 
//   selectedBrands: string[] = []; 
  
//   countries: any[] = [];
//   pic_countries: any[] = [];

//   retailers: any[] = [];
//   alloutlets: any[] = [];
//   allretailers: any[] = [];
//   useroutlet: any;
//   usercategory: any;
//   promoters: any[] = [];
//   compSalesData: any[] = [];
//   errorMessage: string = '';
//   compQuantityTotal: number = 0;
//   compTotal: number = 0;

//   outlets: any[] = [];
//   categories: any[] = [];

//   products: any[] = [];

//   selectedProduct: any;
//   selectedCountry: any;
//   selectedRetailer: any;
//   selectedOutlet: any;
//   selectedCategory: any;
//   selectedPromoter: any;
//   selectedFromDate: string | null = null;
//   selectedToDate: string | null = null;
//   isToDisabledownload: boolean = true;

//   categoryOptions = {
//     header: 'Select Category'
//   };

//   brandsOptions = {
//     header: 'Select Brand'
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

//   // showupdatefeedbackbtn: boolean = false;
//   userRole: number | null =  null;

//   onFromDateChange(event: any) {
//     // Get the full date from the event
//     const fullDate = new Date(event.detail.value);

//     // Convert to 'YYYY-MM-DD' format
//     const year = fullDate.getFullYear();
//     const month = String(fullDate.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
//     const day = String(fullDate.getDate()).padStart(2, '0');

//     this.selectedFromDate = `${year}-${month}-${day}`;
//     this.fromPopover?.dismiss();
//   }

//   onToDateChange(event: any) {
//     // Get the full date from the event
//     const fullDate = new Date(event.detail.value);

//     // Convert to 'YYYY-MM-DD' format
//     const year = fullDate.getFullYear();
//     const month = String(fullDate.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
//     const day = String(fullDate.getDate()).padStart(2, '0');
//     this.selectedToDate = `${year}-${month}-${day}`;
//     this.toPopover?.dismiss();

//   }


//   constructor(private alertController: AlertController, private apiService: ApiService, private userService: UserService,private authservice:AuthService) { }

//   ngOnInit() {
//   this.getUserRole();
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
//     this.loadBrands();
//     this.fetchAllCountries();
//     this.fetchAllCategories();
//     this.fetchAllRetailers();
//     this.fetchAllOutlets();
//   }



//   fetchUserData() {
//     const userIdString = localStorage.getItem('userId');
//     const userId = userIdString ? Number(userIdString) : null;
//     // const roleId = localStorage.getItem('roleId');
//     const roleId = this.roleId;


//     if (userId !== null) {
//       // Check if roleId is '1' (superadmin)
//       if (roleId === '1') {
//         console.log('Superadmin detected');
//       } else if (roleId === '4') {
//         this.userService.fetchUsertableData(userId).subscribe(
//           (response) => {
//             // Check if response is valid and has a message property
//             if (response && response.status) {
//               // this.setUserData(response.data);
//               this.handleMultiRegionId(response.data.multi_region_id);
//             } else {
//               console.error('Failed to fetch user data:', response?.message || 'Unknown error');
//             }
//           },
//           (error) => {
//             console.error('Error fetching user data:', error);
//           }
//         );
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
//       const outlet = this.alloutlets.find(o => o.report_name === userData.store_name && o.retailer_id === retailerId.id);
//       if (outlet) {
//         this.useroutlet = outlet.id;
//       } else {
//         // No matching outlet found
//         console.log('No matching outlet found for the given store name and retailer ID');
//       }
//     } else {
//       // No matching retailer found
//       console.log('No matching retailer found for the given retailer name');
//     }
//   }

//   handleMultiRegionId(multiRegionIds: string) {
//     // Split the multi_region_id string into an array
//     const regionIds = multiRegionIds.split(',').map(id => id.trim());
//     console.log(regionIds);

//     // Fetch all countries
//     this.fetchAllCountries().then(() => {
//       // Filter countries based on multi_region_ids
//       this.pic_countries = this.countries.filter(country => regionIds.includes(country.id.toString()));
//       console.log(this.pic_countries);

//       if (this.pic_countries.length > 0) {
//         console.log('Filtered countries based on multi_region_id:', this.pic_countries);
//       } else {
//         console.warn('No countries found for the given multi_region_id');
//       }
//     });
//   }


//   //use in case of promoters only
//   fetchAllOutlets() {
//     this.apiService.getAllOutlets().subscribe(
//       (response) => {
//         this.alloutlets = response.data;
//         // console.log(this.alloutlets);
//         this.fetchUserData();
//       },
//       (error) => {
//         console.error('Error fetching outlets:', error);
//       }
//     );
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
//     return new Promise((resolve, reject) => {
//       this.apiService.getAllCountries().subscribe(
//         (response) => {
//           this.countries = response.data;
//           resolve(this.countries);
//         },
//         (error) => {
//           console.error('Error fetching countries:', error);
//           reject(error);
//         }
//       );
//     });
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

 

//   // fetchProductsByCategory(categoryId: number) {
//   //   this.apiService.getProductsByCategory(categoryId).subscribe(
//   //     (response) => {
//   //       if (response.status) {
//   //         this.products = response.data; // Store fetched products
//   //       } else {
//   //         console.error('Failed to fetch products:', response.message);
//   //       }
//   //     },
//   //     (error) => {
//   //       console.error('Error fetching products:', error);
//   //       this.products = []; // Reset products if an error occurs
//   //     }
//   //   );
//   // }


//   onProductSelected(productId: any) {
//     console.log('Selected Product ID:', productId);
//     this.selectedProduct = productId.id;
//   }

//   loadBrands() {
//     this.apiService.getBrands().subscribe(
//       (data) => {
//         this.brands = data;
//         console.log(this.brands);
//       },
//       (error) => {
//         console.error('Error fetching brands:', error);
//       }
//     );
//   }
//   async onCategoryChange(categoryId: number) {
//     if (categoryId) {
//         this.usercategory = categoryId;
//         const brand = this.selectedBrands;

//         // Remove spaces within each brand name
//         const cleanedBrands = brand.map((b: string) => b.replace(/\s+/g, '')); 
//         this.selectedBrands = cleanedBrands;//send in get api

//         const brandString = cleanedBrands.join(','); 

//         console.log(brandString); 
//         // const roleId = Number(localStorage.getItem('roleId'));
//         const roleId = Number(this.roleId);


//         // Check conditions and fetch products if valid
//         if (brandString && categoryId && roleId !== 3) {
//             this.fetchBrandProductsByCategorynBrands(brandString, categoryId);
//         }
//     } else {
//         this.usercategory = null;
//     }
// }

//   onBrandChange(event: any) {
//     // Get selected brands from the event
//     this.selectedBrands = event.detail.value; 
//     const category = this.usercategory;
//     const brand = this.selectedBrands;

//     // Remove spaces within each brand name
//     const cleanedBrands = brand.map((b: string) => b.replace(/\s+/g, ''));
//         this.selectedBrands = cleanedBrands;//send in get api

//     // Join the cleaned brand names into a string
//     const brandString = cleanedBrands.join(','); 

//     // Retrieve roleId from localStorage
//     // const roleId = Number(localStorage.getItem('roleId'));
//     const roleId = Number(this.roleId);


//     // Check conditions and fetch products if valid
//     if (category && brandString && roleId !== 3) {
//         this.fetchBrandProductsByCategorynBrands(brandString, category);
//     }
// }


//   //   // Fetch brand products by category and brand
//   // fetchBrandProductsByCategorynBrands(brand: string, categoryId: number) {
//   //   this.apiService.getProductsByCategorynBrands(brand, categoryId).subscribe(
//   //       (response) => {
//   //           if (response.status) {
//   //               this.products = response.data;
//   //               console.log(this.products);
//   //             //   [
//   //             //     "AIRPODS 1",
//   //             //     "AIRPODS 2",
//   //             //     "AIRPODS 3",
//   //             //     "AIRPODS MAX",
//   //             //     "AIRPODS PRO",
//   //             //     "AIRPODS PRO 2",
//   //             //     "EARPODS"
//   //             // ]

//   //             // convert this in below format with only fill name and id with obeove values and all are null
//   //             // {
//   //             //   "status": true,
//   //             //   "data": [
//   //             //       {
//   //             //           "id": "1",
//   //             //           "code": "DI035",
//   //             //           "name": "FDR-AX53 ",
//   //             //           "segment": "4K CAM",
//   //             //           "category_id": "2",
//   //             //           "active": "1",
//   //             //           "created_on": "0000-00-00 00:00:00",
//   //             //           "updated_on": "2023-08-29 09:54:10"
//   //             //       },
//   //             //       {
//   //             //           "id": "2",
//   //             //           "code": "DI040",
//   //             //           "name": "FDR-AX700",
//   //             //           "segment": "4K CAM",
//   //             //           "category_id": "2",
//   //             //           "active": "1",
//   //             //           "created_on": "0000-00-00 00:00:00",
//   //             //           "updated_on": "2023-08-29 09:54:10"
//   //             //       },

//   //               // Check if products array is empty
//   //               if (this.products.length === 0) {
//   //                   this.showIndependentAlert('No models found with the above selection.');
//   //               }
//   //           } else {
//   //               console.error('Failed to fetch products:', response.message);
//   //               this.showIndependentAlert('Failed to fetch products: ' + response.message);
//   //           }
//   //       },
//   //       (error) => {
//   //           console.error('Error fetching products:', error);
//   //           this.products = [];
//   //           this.showIndependentAlert('An error occurred while fetching products.');
//   //       }
//   //   );
//   // }

//   fetchBrandProductsByCategorynBrands(brand: string, categoryId: number) {
//     this.apiService.getProductsByCategorynBrands(brand, categoryId).subscribe(
//         (response) => {
//             if (response.status) {
//                 // Check if response.data has products
//                 if (response.data.length > 0) {
//                     // Transform the products to the desired format
//                     this.products = response.data.map((productName: any, index: number) => ({
//                         id: (index + 1).toString(), // Assigning an incremental ID
//                         code: null,
//                         name: productName,
//                         segment: null,
//                         category_id: categoryId.toString(), // Assuming you want to keep the category ID
//                         active: null,
//                         created_on: null,
//                         updated_on: null
//                     }));

//                     // console.log(this.products);
//                 } else {
//                   this.products = [];
//                   this.selectedProduct = null; // Resetting the selected product
//                     // Show alert message that no products were found
//                     this.showIndependentAlert('No products found for the selected brands and category.');
//                 }
//             } else {
//                 console.error('Failed to fetch products:', response.message);
//                 this.showIndependentAlert('Failed to fetch products: ' + response.message);
//             }
//         },
//         (error) => {
//             console.error('Error fetching products:', error);
//             this.products = [];
//             this.showIndependentAlert('An error occurred while fetching products.');
//         }
//     );
// }

//   // Independent alert method
//   async showIndependentAlert(message: string, header: string = 'Notification') {
//     const alert = await this.alertController.create({
//       header: header,
//       message: message,
//       buttons: ['OK']
//     });

//     await alert.present();
//   }



//   //----------------------------------------get api code---------------------------------------------
//   //that view is without pagination
//   // loadCompSalesData() {
//   //   const countryId = this.selectedCountry?.id || 0; 
//   //   const retailerId = this.selectedRetailer?.id || 0; 
//   //   const storeId = this.selectedOutlet?.id || 0; 
//   //   const categoryId = this.selectedCategory?.id || 0; 
//   //   const modelId = this.selectedProduct?.id || '-1'; // Use '-1' for model if not selected
//   //   const fromDate = this.selectedFromDate || '0'; 
//   //   const toDate = this.selectedToDate || '0'; 
//   //   const brands = this.selectedBrands|| []; // Assuming selectedBrands is an array

//   //   // Log all values to the console
//   // console.log('Country ID:', countryId);
//   // console.log('Retailer ID:', retailerId);
//   // console.log('Store ID:', storeId);
//   // console.log('Category ID:', categoryId);
//   // console.log('Model ID:', modelId);
//   // console.log('From Date:', fromDate);
//   // console.log('To Date:', toDate);
//   // console.log('Brands:', brands);

//   //   this.apiService.getCompsalesData(

//   //     countryId,
//   //     retailerId,
//   //     storeId,
//   //     categoryId,
//   //     modelId,
//   //     brands,
//   //     fromDate,
//   //     toDate
//   //   ).subscribe(
//   //     (response) => {
//   //       if (response.status) {
//   //         if (response.data.sales) {
//   //           if(response.data.sales.length > 0){
//   //             this.compSalesData = response.data.sales; // Assign competitive sales data
//   //           console.log(this.compSalesData);
//   //           this.compQuantityTotal = response.data.quantityTotal; // Assign quantity total for comp sales
//   //           this.compTotal = response.data.total; // Assign total amount for comp sales
//   //           this.errorMessage = ''; 
//   //           this.isToDisabledownload = false;
//   //           }else{
//   //             this.errorMessage = 'No competitive sales data found for the selected criteria.'; // Set error message if no data
//   //             this.isToDisabledownload = true;
//   //             this.compSalesData = []; // Clear comp sales data if none found
//   //           }

//   //         } else {
//   //           console.log("unexpected case");
//   //         }
//   //       } else {
//   //         this.errorMessage = response.message; // Handle other cases with a message from the response
//   //       }
//   //     },
//   //     (error) => {
//   //       console.error('Error fetching competitive sales data:', error);
//   //       this.errorMessage = 'Failed to fetch competitive sales data. Please try again later.';
//   //     }
//   //   );
//   // }

//   //   loadCompSalesData() {
//   //     const countryId = this.selectedCountry?.id || 0; 
//   //     const retailerId = this.selectedRetailer?.id || 0; 
//   //     const storeId = this.selectedOutlet?.id || 0; 
//   //     const categoryId = this.selectedCategory?.id || 0; 
//   //     const modelId = this.selectedProduct?.id || '-1'; // Use '-1' for model if not selected
//   //     const fromDate = this.selectedFromDate || '0'; 
//   //     const toDate = this.selectedToDate || '0'; 
//   //     const brands = this.selectedBrands || []; // Assuming selectedBrands is an array

//   //     // Log all values to the console
//   //     console.log('Country ID:', countryId);
//   //     console.log('Retailer ID:', retailerId);
//   //     console.log('Store ID:', storeId);
//   //     console.log('Category ID:', categoryId);
//   //     console.log('Model ID:', modelId);
//   //     console.log('From Date:', fromDate);
//   //     console.log('To Date:', toDate);
//   //     console.log('Brands:', brands);

//   //     this.apiService.getCompsalesData(
//   //         countryId,
//   //         retailerId,
//   //         storeId,
//   //         categoryId,
//   //         modelId,
//   //         brands,
//   //         fromDate,
//   //         toDate
//   //     ).subscribe(
//   //         (response) => {
//   //             if (response.status) {
//   //                 if (response.data && response.data.sales) {
//   //                     if (response.data.sales.length > 0) {
//   //                         this.compSalesData = response.data.sales; // Assign competitive sales data
//   //                         console.log(this.compSalesData);
//   //                         this.compQuantityTotal = response.data.quantityTotal; // Assign quantity total for comp sales
//   //                         this.compTotal = response.data.total; // Assign total amount for comp sales
//   //                         this.errorMessage = ''; 
//   //                         this.isToDisabledownload = false;
//   //                     } else {
//   //                         // Handle case where sales array is empty
//   //                         this.errorMessage = 'No competitive sales data found for the selected criteria.'; // Set error message if no data
//   //                         this.isToDisabledownload = true;
//   //                         this.compSalesData = []; // Clear comp sales data if none found
//   //                     }
//   //                 } else {

//   //                     console.log("no data object");
//   //                     this.errorMessage = 'No competitive sales data found for the selected criteria.';
//   //                 }
//   //             } else {
//   //                 // Handle case where status is false
//   //                 this.errorMessage = response.message; // Handle other cases with a message from the response
//   //             }
//   //         },
//   //         (error) => {
//   //             console.error('Error fetching competitive sales data:', error);
//   //             this.errorMessage = 'Failed to fetch competitive sales data. Please try again later.';
//   //         }
//   //     );
//   // }

//   currentPage: number = 1; // Current page number
//   itemsPerPage: number = 10; // Number of items per page

//   loadCompSalesData() {
//     const countryId = this.selectedCountry?.id || 0;
//     const retailerId = this.selectedRetailer?.id || 0;
//     const storeId = this.selectedOutlet?.id || 0;
//     const categoryId = this.selectedCategory?.id || 0;
//     const modelId = this.selectedProduct || '-1'; // Use '-1' for model if not selected
//     const fromDate = this.selectedFromDate || '0';
//     const toDate = this.selectedToDate || '0';
//     const brands = this.selectedBrands || []; // Assuming selectedBrands is an array

//     this.apiService.getCompsalesData(
//       countryId,
//       retailerId,
//       storeId,
//       categoryId,
//       modelId,
//       brands,
//       fromDate,
//       toDate
//     ).subscribe(
//       (response) => {
//         if (response.status) {
//           if (response.data && response.data.sales) {
//             if (response.data.sales.length > 0) {
//               this.compSalesData = response.data.sales; // Assign competitive sales data
//               console.log(this.compSalesData);

//               // Directly assign totals from the API response
//               this.compQuantityTotal = response.data.quantityTotal; // Total quantity from API
//               this.compTotal = response.data.total; // Total amount from API
//               this.isToDisabledownload = false;
//               this.errorMessage = '';
//             } else {
//               this.errorMessage = 'No competitive sales data found for the selected criteria.';
//               this.isToDisabledownload = true;
//               this.compSalesData = []; // Clear data if none found
//             }
//           } else {
//             console.log("No data object");
//             this.errorMessage = 'No competitive sales data found for the selected criteria.';
//           }
//         } else {
//           this.errorMessage = response.message; // Handle other cases with a message from the response
//         }
//       },
//       (error) => {
//         console.error('Error fetching competitive sales data:', error);
//         this.errorMessage = 'Failed to fetch competitive sales data. Please try again later.';
//       }
//     );
//   }

//   get paginatedData() {
//     const startIndex = (this.currentPage - 1) * this.itemsPerPage;
//     return this.compSalesData.slice(startIndex, startIndex + this.itemsPerPage);
//   }

//   nextPage() {
//     if (this.currentPage * this.itemsPerPage < this.compSalesData.length) {
//       this.currentPage++;
//     }
//   }

//   previousPage() {
//     if (this.currentPage > 1) {
//       this.currentPage--;
//     }
//   }

//   get totalPages() {
//     return Math.ceil(this.compSalesData.length / this.itemsPerPage);
//   }

//   // New method to open the URL in the browser
//   downloadSalesData() {
//     const countryId = this.selectedCountry?.id || 0;
//     const retailerId = this.selectedRetailer?.id || 0;
//     const storeId = this.selectedOutlet?.id || 0;
//     const categoryId = this.selectedCategory?.id || 0;
//     const modelId = this.selectedProduct?.id || '-1'; // Use '-1' for model if not selected
//     const fromDate = this.selectedFromDate || '0';
//     const toDate = this.selectedToDate || '0';
//     const brands = this.selectedBrands || []; // Assuming selectedBrands is an array


//     // Construct the URL with parameters
//     const url = `https://ekarigartech.com/erp/App_api/compsales_xls/${countryId}/${retailerId}/${storeId}/${categoryId}/${modelId}/${brands}/${fromDate}/${toDate}`;


//     // Open the URL in a new browser tab
//     window.open(url, '_blank');
//   }



//   isAdminFormValid(): boolean {
//     return !!(this.selectedProduct &&
//       this.selectedBrands.length > 0 &&
//       this.selectedCountry && 
//       this.selectedRetailer &&
//       this.selectedOutlet &&
//       this.selectedCategory &&
//       this.selectedFromDate &&
//       this.selectedToDate);
//   }

//   isPromoterFormValid(): boolean {
//     return !!(
//       this.selectedBrands.length > 0 &&
//       // this.selectedBrands > 0 &&

//       this.selectedCategory &&
//       this.selectedFromDate &&
//       this.selectedToDate);
//   }


// }

import { Component, OnInit, ViewChild } from '@angular/core';
import { AlertController, IonPopover } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-view-sales-competition',
  templateUrl: './view-sales-competition.page.html',
  styleUrls: ['./view-sales-competition.page.scss'],
})
export class ViewSalesCompetitionPage implements OnInit {

  @ViewChild('fromPopover') fromPopover?: IonPopover;
  @ViewChild('toPopover') toPopover?: IonPopover;

  isFromPopoverOpen: boolean = false;
  isToPopoverOpen: boolean = false;
  brands: { brand: string }[] = []; 
  selectedBrands: string[] = []; 
  
  countries: any[] = [];
  pic_countries: any[] = [];

  retailers: any[] = [];
  alloutlets: any[] = [];
  allretailers: any[] = [];
  useroutlet: any;
  usercategory: any;
  promoters: any[] = [];
  compSalesData: any[] = [];
  errorMessage: string = '';
  compQuantityTotal: number = 0;
  compTotal: number = 0;

  outlets: any[] = [];
  categories: any[] = [];

  products: any[] = [];

  selectedProduct: any;
  selectedCountry: any;
  selectedRetailer: any;
  selectedOutlet: any;
  selectedCategory: any;
  selectedPromoter: any;
  selectedFromDate: string | null = null;
  selectedToDate: string | null = null;
  isToDisabledownload: boolean = true;

  categoryOptions = {
    header: 'Select Category'
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

  // showupdatefeedbackbtn: boolean = false;
  // userRole: number | null =  null;

  onFromDateChange(event: any) {
    // Get the full date from the event
    const fullDate = new Date(event.detail.value);

    // Convert to 'YYYY-MM-DD' format
    const year = fullDate.getFullYear();
    const month = String(fullDate.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
    const day = String(fullDate.getDate()).padStart(2, '0');

    this.selectedFromDate = `${year}-${month}-${day}`;
    this.fromPopover?.dismiss();
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


  constructor(private alertController: AlertController, private apiService: ApiService, private userService: UserService,private authservice:AuthService) { }

  ngOnInit() {
  this.getUserRole();
  }
  roleId: string | null = null;
  lang: string | null = null;
  cid: string | null = null;
  userRole:number | 0 = 0;
  // errorMessage: string | null = null;
  getUserRole() {
    const UserId = localStorage.getItem('userId');
    if (UserId) {
      this.authservice.getUserRole(UserId).subscribe({
        next: (response) => {
          if (response.status) {
            this.roleId = response.data.role_id; 
            this.userRole = response.data.role_id;
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
    this.loadBrands();
    this.fetchAllCountries();
    this.fetchAllCategories();
    this.fetchAllRetailers();
    this.fetchAllOutlets();
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
      const outlet = this.alloutlets.find(o => o.report_name === userData.store_name && o.retailer_id === retailerId.id);
      if (outlet) {
        this.useroutlet = outlet.id;
      } else {
        // No matching outlet found
        console.log('No matching outlet found for the given store name and retailer ID');
      }
    } else {
      // No matching retailer found
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

 

  // fetchProductsByCategory(categoryId: number) {
  //   this.apiService.getProductsByCategory(categoryId).subscribe(
  //     (response) => {
  //       if (response.status) {
  //         this.products = response.data; // Store fetched products
  //       } else {
  //         console.error('Failed to fetch products:', response.message);
  //       }
  //     },
  //     (error) => {
  //       console.error('Error fetching products:', error);
  //       this.products = []; // Reset products if an error occurs
  //     }
  //   );
  // }


  onProductSelected(productId: any) {
    console.log('Selected Product ID:', productId);
    this.selectedProduct = productId.id;
  }

  loadBrands() {
    this.apiService.getBrands().subscribe(
      (data) => {
        this.brands = data;
        console.log(this.brands);
      },
      (error) => {
        console.error('Error fetching brands:', error);
      }
    );
  }
  async onCategoryChange(categoryId: number) {
    if (categoryId) {
        this.usercategory = categoryId;
        const brand = this.selectedBrands;

        // Remove spaces within each brand name
        const cleanedBrands = brand.map((b: string) => b.replace(/\s+/g, '')); 
        this.selectedBrands = cleanedBrands;//send in get api

        const brandString = cleanedBrands.join(','); 

        console.log(brandString); 
        // const roleId = Number(localStorage.getItem('roleId'));
        const roleId = Number(this.roleId);


        // Check conditions and fetch products if valid
        if (brandString && categoryId && roleId !== 3) {
            this.fetchBrandProductsByCategorynBrands(brandString, categoryId);
        }
    } else {
        this.usercategory = null;
    }
}

  onBrandChange(event: any) {
    // Get selected brands from the event
    this.selectedBrands = event.detail.value; 
    const category = this.usercategory;
    const brand = this.selectedBrands;

    // Remove spaces within each brand name
    const cleanedBrands = brand.map((b: string) => b.replace(/\s+/g, ''));
        this.selectedBrands = cleanedBrands;//send in get api

    // Join the cleaned brand names into a string
    const brandString = cleanedBrands.join(','); 

    // Retrieve roleId from localStorage
    // const roleId = Number(localStorage.getItem('roleId'));
    const roleId = Number(this.roleId);


    // Check conditions and fetch products if valid
    if (category && brandString && roleId !== 3) {
        this.fetchBrandProductsByCategorynBrands(brandString, category);
    }
}


  //   // Fetch brand products by category and brand
  // fetchBrandProductsByCategorynBrands(brand: string, categoryId: number) {
  //   this.apiService.getProductsByCategorynBrands(brand, categoryId).subscribe(
  //       (response) => {
  //           if (response.status) {
  //               this.products = response.data;
  //               console.log(this.products);
  //             //   [
  //             //     "AIRPODS 1",
  //             //     "AIRPODS 2",
  //             //     "AIRPODS 3",
  //             //     "AIRPODS MAX",
  //             //     "AIRPODS PRO",
  //             //     "AIRPODS PRO 2",
  //             //     "EARPODS"
  //             // ]

  //             // convert this in below format with only fill name and id with obeove values and all are null
  //             // {
  //             //   "status": true,
  //             //   "data": [
  //             //       {
  //             //           "id": "1",
  //             //           "code": "DI035",
  //             //           "name": "FDR-AX53 ",
  //             //           "segment": "4K CAM",
  //             //           "category_id": "2",
  //             //           "active": "1",
  //             //           "created_on": "0000-00-00 00:00:00",
  //             //           "updated_on": "2023-08-29 09:54:10"
  //             //       },
  //             //       {
  //             //           "id": "2",
  //             //           "code": "DI040",
  //             //           "name": "FDR-AX700",
  //             //           "segment": "4K CAM",
  //             //           "category_id": "2",
  //             //           "active": "1",
  //             //           "created_on": "0000-00-00 00:00:00",
  //             //           "updated_on": "2023-08-29 09:54:10"
  //             //       },

  //               // Check if products array is empty
  //               if (this.products.length === 0) {
  //                   this.showIndependentAlert('No models found with the above selection.');
  //               }
  //           } else {
  //               console.error('Failed to fetch products:', response.message);
  //               this.showIndependentAlert('Failed to fetch products: ' + response.message);
  //           }
  //       },
  //       (error) => {
  //           console.error('Error fetching products:', error);
  //           this.products = [];
  //           this.showIndependentAlert('An error occurred while fetching products.');
  //       }
  //   );
  // }

  fetchBrandProductsByCategorynBrands(brand: string, categoryId: number) {
    this.apiService.getProductsByCategorynBrands(brand, categoryId).subscribe(
        (response) => {
            if (response.status) {
                // Check if response.data has products
                if (response.data.length > 0) {
                    // Transform the products to the desired format
                    this.products = response.data.map((productName: any, index: number) => ({
                        id: (index + 1).toString(), // Assigning an incremental ID
                        code: null,
                        name: productName,
                        segment: null,
                        category_id: categoryId.toString(), // Assuming you want to keep the category ID
                        active: null,
                        created_on: null,
                        updated_on: null
                    }));

                    // console.log(this.products);
                } else {
                  this.products = [];
                  this.selectedProduct = null; // Resetting the selected product
                    // Show alert message that no products were found
                    this.showIndependentAlert('No products found for the selected brands and category.');
                }
            } else {
                console.error('Failed to fetch products:', response.message);
                this.showIndependentAlert('Failed to fetch products: ' + response.message);
            }
        },
        (error) => {
            console.error('Error fetching products:', error);
            this.products = [];
            this.showIndependentAlert('An error occurred while fetching products.');
        }
    );
}

  // Independent alert method
  async showIndependentAlert(message: string, header: string = 'Notification') {
    const alert = await this.alertController.create({
      header: header,
      message: message,
      buttons: ['OK']
    });

    await alert.present();
  }



  //----------------------------------------get api code---------------------------------------------
  //that view is without pagination
  // loadCompSalesData() {
  //   const countryId = this.selectedCountry?.id || 0; 
  //   const retailerId = this.selectedRetailer?.id || 0; 
  //   const storeId = this.selectedOutlet?.id || 0; 
  //   const categoryId = this.selectedCategory?.id || 0; 
  //   const modelId = this.selectedProduct?.id || '-1'; // Use '-1' for model if not selected
  //   const fromDate = this.selectedFromDate || '0'; 
  //   const toDate = this.selectedToDate || '0'; 
  //   const brands = this.selectedBrands|| []; // Assuming selectedBrands is an array

  //   // Log all values to the console
  // console.log('Country ID:', countryId);
  // console.log('Retailer ID:', retailerId);
  // console.log('Store ID:', storeId);
  // console.log('Category ID:', categoryId);
  // console.log('Model ID:', modelId);
  // console.log('From Date:', fromDate);
  // console.log('To Date:', toDate);
  // console.log('Brands:', brands);

  //   this.apiService.getCompsalesData(

  //     countryId,
  //     retailerId,
  //     storeId,
  //     categoryId,
  //     modelId,
  //     brands,
  //     fromDate,
  //     toDate
  //   ).subscribe(
  //     (response) => {
  //       if (response.status) {
  //         if (response.data.sales) {
  //           if(response.data.sales.length > 0){
  //             this.compSalesData = response.data.sales; // Assign competitive sales data
  //           console.log(this.compSalesData);
  //           this.compQuantityTotal = response.data.quantityTotal; // Assign quantity total for comp sales
  //           this.compTotal = response.data.total; // Assign total amount for comp sales
  //           this.errorMessage = ''; 
  //           this.isToDisabledownload = false;
  //           }else{
  //             this.errorMessage = 'No competitive sales data found for the selected criteria.'; // Set error message if no data
  //             this.isToDisabledownload = true;
  //             this.compSalesData = []; // Clear comp sales data if none found
  //           }

  //         } else {
  //           console.log("unexpected case");
  //         }
  //       } else {
  //         this.errorMessage = response.message; // Handle other cases with a message from the response
  //       }
  //     },
  //     (error) => {
  //       console.error('Error fetching competitive sales data:', error);
  //       this.errorMessage = 'Failed to fetch competitive sales data. Please try again later.';
  //     }
  //   );
  // }

  //   loadCompSalesData() {
  //     const countryId = this.selectedCountry?.id || 0; 
  //     const retailerId = this.selectedRetailer?.id || 0; 
  //     const storeId = this.selectedOutlet?.id || 0; 
  //     const categoryId = this.selectedCategory?.id || 0; 
  //     const modelId = this.selectedProduct?.id || '-1'; // Use '-1' for model if not selected
  //     const fromDate = this.selectedFromDate || '0'; 
  //     const toDate = this.selectedToDate || '0'; 
  //     const brands = this.selectedBrands || []; // Assuming selectedBrands is an array

  //     // Log all values to the console
  //     console.log('Country ID:', countryId);
  //     console.log('Retailer ID:', retailerId);
  //     console.log('Store ID:', storeId);
  //     console.log('Category ID:', categoryId);
  //     console.log('Model ID:', modelId);
  //     console.log('From Date:', fromDate);
  //     console.log('To Date:', toDate);
  //     console.log('Brands:', brands);

  //     this.apiService.getCompsalesData(
  //         countryId,
  //         retailerId,
  //         storeId,
  //         categoryId,
  //         modelId,
  //         brands,
  //         fromDate,
  //         toDate
  //     ).subscribe(
  //         (response) => {
  //             if (response.status) {
  //                 if (response.data && response.data.sales) {
  //                     if (response.data.sales.length > 0) {
  //                         this.compSalesData = response.data.sales; // Assign competitive sales data
  //                         console.log(this.compSalesData);
  //                         this.compQuantityTotal = response.data.quantityTotal; // Assign quantity total for comp sales
  //                         this.compTotal = response.data.total; // Assign total amount for comp sales
  //                         this.errorMessage = ''; 
  //                         this.isToDisabledownload = false;
  //                     } else {
  //                         // Handle case where sales array is empty
  //                         this.errorMessage = 'No competitive sales data found for the selected criteria.'; // Set error message if no data
  //                         this.isToDisabledownload = true;
  //                         this.compSalesData = []; // Clear comp sales data if none found
  //                     }
  //                 } else {

  //                     console.log("no data object");
  //                     this.errorMessage = 'No competitive sales data found for the selected criteria.';
  //                 }
  //             } else {
  //                 // Handle case where status is false
  //                 this.errorMessage = response.message; // Handle other cases with a message from the response
  //             }
  //         },
  //         (error) => {
  //             console.error('Error fetching competitive sales data:', error);
  //             this.errorMessage = 'Failed to fetch competitive sales data. Please try again later.';
  //         }
  //     );
  // }

  currentPage: number = 1; // Current page number
  itemsPerPage: number = 10; // Number of items per page

  loadCompSalesData() {
    const countryId = this.selectedCountry?.id || 0;
    const retailerId = this.selectedRetailer?.id || 0;
    const storeId = this.selectedOutlet?.id || 0;
    const categoryId = this.selectedCategory?.id || 0;
    const modelId = this.selectedProduct || '-1'; // Use '-1' for model if not selected
    const fromDate = this.selectedFromDate || '0';
    const toDate = this.selectedToDate || '0';
    const brands = this.selectedBrands || []; // Assuming selectedBrands is an array

    this.apiService.getCompsalesData(
      countryId,
      retailerId,
      storeId,
      categoryId,
      modelId,
      brands,
      fromDate,
      toDate
    ).subscribe(
      (response) => {
        if (response.status) {
          if (response.data && response.data.sales) {
            if (response.data.sales.length > 0) {
              this.compSalesData = response.data.sales; // Assign competitive sales data
              console.log(this.compSalesData);

              // Directly assign totals from the API response
              this.compQuantityTotal = response.data.quantityTotal; // Total quantity from API
              this.compTotal = response.data.total; // Total amount from API
              this.isToDisabledownload = false;
              this.errorMessage = '';
            } else {
              this.errorMessage = 'No competitive sales data found for the selected criteria.';
              this.isToDisabledownload = true;
              this.compSalesData = []; // Clear data if none found
            }
          } else {
            console.log("No data object");
            this.errorMessage = 'No competitive sales data found for the selected criteria.';
          }
        } else {
          this.errorMessage = response.message; // Handle other cases with a message from the response
        }
      },
      (error) => {
        console.error('Error fetching competitive sales data:', error);
        this.errorMessage = 'Failed to fetch competitive sales data. Please try again later.';
      }
    );
  }

  get paginatedData() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.compSalesData.slice(startIndex, startIndex + this.itemsPerPage);
  }

  nextPage() {
    if (this.currentPage * this.itemsPerPage < this.compSalesData.length) {
      this.currentPage++;
    }
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  get totalPages() {
    return Math.ceil(this.compSalesData.length / this.itemsPerPage);
  }

  // New method to open the URL in the browser
  downloadSalesData() {
    const countryId = this.selectedCountry?.id || 0;
    const retailerId = this.selectedRetailer?.id || 0;
    const storeId = this.selectedOutlet?.id || 0;
    const categoryId = this.selectedCategory?.id || 0;
    const modelId = this.selectedProduct?.id || '-1'; // Use '-1' for model if not selected
    const fromDate = this.selectedFromDate || '0';
    const toDate = this.selectedToDate || '0';
    const brands = this.selectedBrands || []; // Assuming selectedBrands is an array


    // Construct the URL with parameters
    // const url = `https://ekarigartech.com/happy_pta/App_api/compsales_xls/${countryId}/${retailerId}/${storeId}/${categoryId}/${modelId}/${brands}/${fromDate}/${toDate}`;
    const url = `${environment.apiBaseUrl}/App_api/compsales_xls/${countryId}/${retailerId}/${storeId}/${categoryId}/${modelId}/${brands}/${fromDate}/${toDate}`;



    // Open the URL in a new browser tab
    window.open(url, '_blank');
  }



  isAdminFormValid(): boolean {
    return !!(this.selectedProduct &&
      this.selectedBrands.length > 0 &&
      this.selectedCountry && 
      this.selectedRetailer &&
      this.selectedOutlet &&
      this.selectedCategory &&
      this.selectedFromDate &&
      this.selectedToDate);
  }

  isPromoterFormValid(): boolean {
    return !!(
      this.selectedBrands.length > 0 &&
      // this.selectedBrands > 0 &&

      this.selectedCategory &&
      this.selectedFromDate &&
      this.selectedToDate);
  }


}
