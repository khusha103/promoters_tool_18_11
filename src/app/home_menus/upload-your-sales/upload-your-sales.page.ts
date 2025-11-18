// // import { Component, OnInit, ViewChild } from '@angular/core';
// // import { AlertController, IonPopover, ModalController, ToastController } from '@ionic/angular';
// // import { ApiService } from 'src/app/services/api.service';
// // import { UserService } from 'src/app/services/user.service';

// // @Component({
// //   selector: 'app-upload-your-sales',
// //   templateUrl: './upload-your-sales.page.html',
// //   styleUrls: ['./upload-your-sales.page.scss'],
// // })
// // export class UploadYourSalesPage implements OnInit {

// //   @ViewChild('fromPopover') fromPopover?: IonPopover;

// //   isFromPopoverOpen: boolean = false;
// //   selectedFromDate: string | null = null;
// //   categories: any[] = [];
// //   products: any[] = [];
// //   alloutlets: any[] = [];
// //   allretailers: any[] = [];
// //   userIdfromlocal: any;


// //   selectedCategory: any;
// //   selectedProduct: any;
// //   useroutlet: any;

// //   onFromDateChange(event: any) {
// //     // Get the full date from the event
// //     const fullDate = new Date(event.detail.value);
// //     const year = fullDate.getFullYear();
// //     const month = String(fullDate.getMonth() + 1).padStart(2, '0');
// //     const day = String(fullDate.getDate()).padStart(2, '0');

// //     this.selectedFromDate = `${year}-${month}-${day}`;
// //     this.fromPopover?.dismiss();
// //   }


// //   tableRows: any[] = [];

// //   constructor(private alertController: AlertController, private apiService: ApiService, private userService: UserService, private toastController: ToastController) { }

// //   ngOnInit() {
// //     this.initializeRows();
// //     this.fetchAllCategories();
// //     this.fetchAllRetailers();
// //     this.fetchAllOutlets();
// //   }

// //   selectedProducts: { [key: number]: any } = {}; // To track selected products by row ID
// //   onProductSelected(event: { productId: any, rowId: number }) {
// //     const { productId, rowId } = event;
// //     this.selectedProducts[rowId] = productId.id;

// //     // Log the selected product and row ID
// //     console.log('Selected Product ID:', productId);
// //     console.log('Row ID:', rowId);

// //     // Optionally, log the entire selected products object for debugging
// //     console.log('All Selected Products:', this.selectedProducts);

// //   }

// //   fetchUserData() {
// //     const userIdString = localStorage.getItem('userId');
// //     const userId = userIdString ? Number(userIdString) : null;
// //     this.userIdfromlocal = userId;
// //     const roleId = localStorage.getItem('roleId');

// //     if (userId !== null) {
// //       // Check if roleId is '1' (superadmin)
// //       if (roleId === '1') {
// //         console.log('Superadmin detected');
// //       } else {
// //         this.userService.fetchUserData(userId).subscribe(
// //           (response) => {
// //             // Check if response is valid and has a message property
// //             if (response && response.status) {
// //               this.setUserData(response.data);
// //               // console.log(response.data);
// //             } else {
// //               console.error('Failed to fetch user data:', response?.message || 'Unknown error');
// //             }
// //           },
// //           (error) => {
// //             console.error('Error fetching user data:', error);
// //           }
// //         );
// //       }
// //     } else {
// //       console.warn('No user ID found in local storage.');
// //     }
// //   }


// //   setUserData(userData: any) {
// //     const retailerId = this.allretailers.find(r => r.name === userData.retailer_name); // Get retailer ID

// //     if (retailerId.id) {
// //       // Filter outlets based on the retailer ID
// //       const outlet = this.alloutlets.find(o => o.report_name === userData.store_name && o.retailer_id === retailerId.id);
// //       if (outlet) {
// //         this.useroutlet = Number(outlet.id);
// //         console.log("storeid", this.useroutlet);
// //         // this.fetchPromoters();
// //         // Outlet found with matching store name and retailer ID
// //         // console.log('Found Outlet:', outlet);
// //       } else {
// //         // No matching outlet found
// //         console.log('No matching outlet found for the given store name and retailer ID');
// //       }
// //     } else {
// //       // No matching retailer found
// //       console.log('No matching retailer found for the given retailer name');
// //     }
// //   }

// //   //use in case of promoters only
// //   fetchAllRetailers() {
// //     this.apiService.getAllRetailers().subscribe(
// //       (response) => {
// //         this.allretailers = response.data;
// //         // console.log(this.allretailers);
// //       },
// //       (error) => {
// //         console.error('Error fetching Retailers:', error);
// //       }
// //     );
// //   }

// //   //use in case of promoters only
// //   fetchAllOutlets() {
// //     this.apiService.getAllOutlets().subscribe(
// //       (response) => {
// //         this.alloutlets = response.data;
// //         // console.log(this.alloutlets);
// //         this.fetchUserData();
// //       },
// //       (error) => {
// //         console.error('Error fetching outlets:', error);
// //       }
// //     );
// //   }


// //   initializeRows() {
// //     this.tableRows = [
// //       { serialNumber: 1, selectedProduct: null },
// //       { serialNumber: 2, selectedProduct: null },
// //       { serialNumber: 3, selectedProduct: null },
// //       { serialNumber: 4, selectedProduct: null }
// //     ];
// //   }



// //   addRow() {
// //     const newSerialNumber = this.tableRows.length + 1;
// //     this.tableRows.push({ serialNumber: newSerialNumber });
// //   }

// //   fetchAllCategories() {
// //     this.apiService.getAllCategories().subscribe(
// //       (response) => {
// //         if (response.status) { // Assuming your API response has a status field
// //           this.categories = response.data; // Store the fetched categories
// //         } else {
// //           console.error('Failed to fetch categories:', response.message);
// //         }
// //       },
// //       (error) => {
// //         console.error('Error fetching categories:', error);
// //       }
// //     );
// //   }

// //   async onCategoryChange(categoryId: number) {
// //     if (categoryId) {
// //       // console.log("catid on change",categoryId);

// //       // this.usercategory = categoryId;

// //       this.fetchProductsByCategory(categoryId);
// //     } else {
// //       // Reset all dependent dropdowns if no category is selected
// //       // this.usercategory = null;
// //     }
// //   }

// //   fetchProductsByCategory(categoryId: number) {
// //     this.apiService.getProductsByCategory(categoryId).subscribe(
// //       (response) => {
// //         if (response.status) {
// //           this.products = response.data; // Store fetched products
// //           console.log(this.products);
// //         } else {
// //           console.error('Failed to fetch products:', response.message);
// //         }
// //       },
// //       (error) => {
// //         console.error('Error fetching products:', error);
// //         this.products = []; // Reset products if an error occurs
// //       }
// //     );
// //   }

// //   async submitSales() {
// //     // Validate required fields
// //     if (!this.selectedFromDate) {
// //       this.showAlert('Error', 'Please select a date.');
// //       return;
// //     }

// //     if (!this.selectedCategory) {
// //       this.showAlert('Error', 'Please select a category.');
// //       return;
// //     }

// //     const hasInvalidRows = this.tableRows.some(row => {
// //       return !this.selectedProducts[row.serialNumber] || row.quantity <= 0 || row.price <= 0;
// //     });

// //     if (hasInvalidRows) {
// //       this.showAlert('Error', 'Please ensure all rows have a selected model, quantity, and price greater than zero.');
// //       return;
// //     }

// //     const alert = await this.alertController.create({
// //       header: 'Confirm Submission',
// //       message: 'Are you sure you want to submit the sales data?',
// //       buttons: [
// //         {
// //           text: 'Cancel',
// //           role: 'cancel',
// //           cssClass: 'secondary',
// //           handler: () => {
// //             console.log('Submission canceled');
// //           }
// //         },
// //         {
// //           text: 'Confirm',
// //           handler: () => {
// //             // Proceed with submission
// //             const saleData = {
// //               userId: this.userIdfromlocal,
// //               storeId: this.useroutlet,
// //               categoryId: Number(this.selectedCategory?.id),
// //               saleDate: this.selectedFromDate,
// //               models: this.tableRows.map(row => ({
// //                 // id: row.selectedProduct?.id,
// //                 id: this.selectedProducts[row.serialNumber],
// //                 quantity: row.quantity || 0,
// //                 price: row.price || 0
// //               })).filter(model => model.id)
// //             };

// //             console.log("salesdata", saleData);

// //             this.apiService.submitSales(saleData).subscribe(
// //               response => {
// //                 if (response.status) {
// //                   console.log('Sales data submitted successfully:', response.data);
// //                   // Reset fields upon successful submission
// //                   this.resetFields();
// //                   this.presentToast();
// //                 } else {
// //                   console.error('Failed to submit sales data:', response.message);
// //                 }
// //               },
// //               error => {
// //                 console.error('Error submitting sales data:', error);
// //               }
// //             );
// //           }
// //         }
// //       ]
// //     });

// //     await alert.present();
// //   }

// //   // Method to reset all fields
// //   resetFields() {
// //     this.selectedFromDate = null;
// //     this.selectedCategory = null;
// //     this.products = [];
// //     this.initializeRows();
// //   }

// //   // Helper method to show alert messages
// //   async showAlert(header: string, message: string) {
// //     const alert = await this.alertController.create({
// //       header,
// //       message,
// //       buttons: ['OK']
// //     });

// //     await alert.present();
// //   }

// //   async presentToast() {
// //     const toast = await this.toastController.create({
// //       message: 'Data submitted successfully!',
// //       duration: 2000,
// //       position: 'bottom',
// //       color: 'success',
// //       cssClass: 'custom-toast'
// //     });
// //     await toast.present();
// //   }

// // }


// // import { Component, OnInit, ViewChild } from '@angular/core';
// // import { AlertController, IonPopover, ModalController, ToastController } from '@ionic/angular';
// // import { ApiService } from 'src/app/services/api.service';
// // import { AuthService } from 'src/app/services/auth.service';
// // import { UserService } from 'src/app/services/user.service';

// // @Component({
// //   selector: 'app-upload-your-sales',
// //   templateUrl: './upload-your-sales.page.html',
// //   styleUrls: ['./upload-your-sales.page.scss'],
// // })
// // export class UploadYourSalesPage implements OnInit {

// //   @ViewChild('fromPopover') fromPopover?: IonPopover;

// //   isFromPopoverOpen: boolean = false;
// //   selectedFromDate: string | null = null;
// //   categories: any[] = [];
// //   products: any[] = [];
// //   alloutlets: any[] = [];
// //   allretailers: any[] = [];
// //   userIdfromlocal: any;


// //   selectedCategory: any;
// //   selectedProduct: any;
// //   useroutlet: any;

// //   onFromDateChange(event: any) {
// //     // Get the full date from the event
// //     const fullDate = new Date(event.detail.value);
// //     const year = fullDate.getFullYear();
// //     const month = String(fullDate.getMonth() + 1).padStart(2, '0');
// //     const day = String(fullDate.getDate()).padStart(2, '0');

// //     this.selectedFromDate = `${year}-${month}-${day}`;
// //     this.fromPopover?.dismiss();
// //   }


// //   tableRows: any[] = [];

// //   constructor(private authservice:AuthService,private alertController: AlertController, private apiService: ApiService, private userService: UserService, private toastController: ToastController) { }

// //   ngOnInit() {
// //     this.getUserRole();
// //   }

// //   roleId: string | null = null;
// //   lang: string | null = null;
// //   cid: string | null = null;
// //   errorMessage: string | null = null;
// //   getUserRole() {
// //     const UserId = localStorage.getItem('userId');
// //     if (UserId) {
// //       this.authservice.getUserRole(UserId).subscribe({
// //         next: (response) => {
// //           if (response.status) {
// //             this.roleId = response.data.role_id; 
// //             this.cid=response.data.region_id;
// //             this.lang =response.data.user_lang;
// //             //when get roleid then call methods
// //             this.intializeapp();
// //           } else {
// //             this.errorMessage = response.message; // Handle error message
// //           }
// //         },
// //         error: (error) => {
// //           console.error('API Error:', error);
// //           this.errorMessage = 'Failed to retrieve user role. Please try again later.';
// //         }
// //       });
// //     }
// //   }

// //   intializeapp(){
// //     this.initializeRows();
// //     this.fetchAllCategories();
// //     this.fetchAllRetailers();
// //     this.fetchAllOutlets();
// //   }

// //   selectedProducts: { [key: number]: any } = {}; // To track selected products by row ID
// //   onProductSelected(event: { productId: any, rowId: number }) {
// //     const { productId, rowId } = event;
// //     this.selectedProducts[rowId] = productId.id;

// //     // Log the selected product and row ID
// //     console.log('Selected Product ID:', productId);
// //     console.log('Row ID:', rowId);

// //     // Optionally, log the entire selected products object for debugging
// //     console.log('All Selected Products:', this.selectedProducts);

// //   }

// //   fetchUserData() {
// //     const userIdString = localStorage.getItem('userId');
// //     const userId = userIdString ? Number(userIdString) : null;
// //     this.userIdfromlocal = userId;
// //        // const roleId = localStorage.getItem('roleId');
// //        const roleId = this.roleId;

// //     if (userId !== null) {
// //       // Check if roleId is '1' (superadmin)
// //       if (roleId === '1') {
// //         console.log('Superadmin detected');
// //       } else {
// //         this.userService.fetchUserData(userId).subscribe(
// //           (response) => {
// //             // Check if response is valid and has a message property
// //             if (response && response.status) {
// //               this.setUserData(response.data);
// //               // console.log(response.data);
// //             } else {
// //               console.error('Failed to fetch user data:', response?.message || 'Unknown error');
// //             }
// //           },
// //           (error) => {
// //             console.error('Error fetching user data:', error);
// //           }
// //         );
// //       }
// //     } else {
// //       console.warn('No user ID found in local storage.');
// //     }
// //   }


// //   setUserData(userData: any) {
// //     const retailerId = this.allretailers.find(r => r.name === userData.retailer_name); // Get retailer ID

// //     if (retailerId.id) {
// //       // Filter outlets based on the retailer ID
// //       const outlet = this.alloutlets.find(o => o.report_name === userData.store_name && o.retailer_id === retailerId.id);
// //       if (outlet) {
// //         this.useroutlet = Number(outlet.id);
// //         console.log("storeid", this.useroutlet);
// //       } else {
// //         // No matching outlet found
// //         console.log('No matching outlet found for the given store name and retailer ID');
// //       }
// //     } else {
// //       // No matching retailer found
// //       console.log('No matching retailer found for the given retailer name');
// //     }
// //   }

// //   //use in case of promoters only
// //   fetchAllRetailers() {
// //     this.apiService.getAllRetailers().subscribe(
// //       (response) => {
// //         this.allretailers = response.data;
// //         // console.log(this.allretailers);
// //       },
// //       (error) => {
// //         console.error('Error fetching Retailers:', error);
// //       }
// //     );
// //   }

// //   //use in case of promoters only
// //   fetchAllOutlets() {
// //     this.apiService.getAllOutlets().subscribe(
// //       (response) => {
// //         this.alloutlets = response.data;
// //         // console.log(this.alloutlets);
// //         this.fetchUserData();
// //       },
// //       (error) => {
// //         console.error('Error fetching outlets:', error);
// //       }
// //     );
// //   }


// //   initializeRows() {
// //     this.tableRows = [
// //       { serialNumber: 1, selectedProduct: null },
// //       { serialNumber: 2, selectedProduct: null },
// //       { serialNumber: 3, selectedProduct: null },
// //       { serialNumber: 4, selectedProduct: null }
// //     ];
// //   }



// //   addRow() {
// //     const newSerialNumber = this.tableRows.length + 1;
// //     this.tableRows.push({ serialNumber: newSerialNumber });
// //   }

// //   fetchAllCategories() {
// //     this.apiService.getAllCategories().subscribe(
// //       (response) => {
// //         if (response.status) { // Assuming your API response has a status field
// //           this.categories = response.data; // Store the fetched categories
// //         } else {
// //           console.error('Failed to fetch categories:', response.message);
// //         }
// //       },
// //       (error) => {
// //         console.error('Error fetching categories:', error);
// //       }
// //     );
// //   }

// //   async onCategoryChange(categoryId: number) {
// //     if (categoryId) {
// //       // console.log("catid on change",categoryId);

// //       // this.usercategory = categoryId;

// //       this.fetchProductsByCategory(categoryId);
// //     } else {
// //       // Reset all dependent dropdowns if no category is selected
// //       // this.usercategory = null;
// //     }
// //   }

// //   fetchProductsByCategory(categoryId: number) {
// //     this.apiService.getProductsByCategory(categoryId).subscribe(
// //       (response) => {
// //         if (response.status) {
// //           this.products = response.data; // Store fetched products
// //           console.log(this.products);
// //         } else {
// //           console.error('Failed to fetch products:', response.message);
// //         }
// //       },
// //       (error) => {
// //         console.error('Error fetching products:', error);
// //         this.products = []; // Reset products if an error occurs
// //       }
// //     );
// //   }

// //   async submitSales() {
// //     // Validate required fields
// //     if (!this.selectedFromDate) {
// //       this.showAlert('Error', 'Please select a date.');
// //       return;
// //     }

// //     if (!this.selectedCategory) {
// //       this.showAlert('Error', 'Please select a category.');
// //       return;
// //     }

// //     const hasInvalidRows = this.tableRows.some(row => {
// //       return !this.selectedProducts[row.serialNumber] || row.quantity <= 0 || row.price <= 0;
// //     });

// //     if (hasInvalidRows) {
// //       this.showAlert('Error', 'Please ensure all rows have a selected model, quantity, and price greater than zero.');
// //       return;
// //     }

// //     const alert = await this.alertController.create({
// //       header: 'Confirm Submission',
// //       message: 'Are you sure you want to submit the sales data?',
// //       buttons: [
// //         {
// //           text: 'Cancel',
// //           role: 'cancel',
// //           cssClass: 'secondary',
// //           handler: () => {
// //             console.log('Submission canceled');
// //           }
// //         },
// //         {
// //           text: 'Confirm',
// //           handler: () => {
// //             // Proceed with submission
// //             const saleData = {
// //               userId: this.userIdfromlocal,
// //               storeId: this.useroutlet,
// //               categoryId: Number(this.selectedCategory?.id),
// //               saleDate: this.selectedFromDate,
// //               models: this.tableRows.map(row => ({
// //                 // id: row.selectedProduct?.id,
// //                 id: this.selectedProducts[row.serialNumber],
// //                 quantity: row.quantity || 0,
// //                 price: row.price || 0
// //               })).filter(model => model.id)
// //             };

// //             console.log("salesdata", saleData);

// //             this.apiService.submitSales(saleData).subscribe(
// //               response => {
// //                 if (response.status) {
// //                   console.log('Sales data submitted successfully:', response.data);
// //                   // Reset fields upon successful submission
// //                   this.resetFields();
// //                   this.presentToast();
// //                 } else {
// //                   console.error('Failed to submit sales data:', response.message);
// //                 }
// //               },
// //               error => {
// //                 console.error('Error submitting sales data:', error);
// //               }
// //             );
// //           }
// //         }
// //       ]
// //     });

// //     await alert.present();
// //   }

// //   // Method to reset all fields
// //   resetFields() {
// //     this.selectedFromDate = null;
// //     this.selectedCategory = null;
// //     this.products = [];
// //     this.initializeRows();
// //   }

// //   // Helper method to show alert messages
// //   async showAlert(header: string, message: string) {
// //     const alert = await this.alertController.create({
// //       header,
// //       message,
// //       buttons: ['OK']
// //     });

// //     await alert.present();
// //   }

// //   async presentToast() {
// //     const toast = await this.toastController.create({
// //       message: 'Data submitted successfully!',
// //       duration: 2000,
// //       position: 'bottom',
// //       color: 'success',
// //       cssClass: 'custom-toast'
// //     });
// //     await toast.present();
// //   }

// // }

// import { Component, OnInit, ViewChild } from '@angular/core';
// import { ActionSheetController, AlertController, IonPopover, ModalController, ToastController } from '@ionic/angular';
// import { ApiService } from 'src/app/services/api.service';
// import { AuthService } from 'src/app/services/auth.service';
// import { UserService } from 'src/app/services/user.service';

// @Component({
//   selector: 'app-upload-your-sales',
//   templateUrl: './upload-your-sales.page.html',
//   styleUrls: ['./upload-your-sales.page.scss'],
// })
// export class UploadYourSalesPage implements OnInit {

//   @ViewChild('fromPopover') fromPopover?: IonPopover;

//   isFromPopoverOpen: boolean = false;
//   selectedFromDate: string | null = null;
//   categories: any[] = [];
//   products: any[] = [];
//   alloutlets: any[] = [];
//   allretailers: any[] = [];
//   userIdfromlocal: any;


//   selectedCategory: any;
//   selectedProduct: any;
//   useroutlet: any;

//   onFromDateChange(event: any) {
//     // Get the full date from the event
//     const fullDate = new Date(event.detail.value);
//     const year = fullDate.getFullYear();
//     const month = String(fullDate.getMonth() + 1).padStart(2, '0');
//     const day = String(fullDate.getDate()).padStart(2, '0');

//     this.selectedFromDate = `${year}-${month}-${day}`;
//     this.fromPopover?.dismiss();
//   }


//   tableRows: any[] = [];

//   constructor(private actionSheetCtrl:ActionSheetController,private authservice:AuthService,private alertController: AlertController, private apiService: ApiService, private userService: UserService, private toastController: ToastController) { }

//   ngOnInit() {
//     this.getUserRole();
//   }

//   // async openActionSheet(row: any) {
    
  
//   //   const actionSheet = await this.actionSheetCtrl.create({
//   //     header: 'Preview Sales Entry',
//   //     subHeader: `
        
//   //         ${row.serialNumber}
             
            
//   //     `,
//   //     buttons: [
//   //       {
//   //         text: 'Submit',
//   //         icon: 'checkmark',
//   //         handler: () => {
//   //           // this.submitRow(row);
//   //         },
//   //       },
//   //       {
//   //         text: 'Cancel',
//   //         icon: 'close',
//   //         role: 'cancel',
//   //       },
//   //     ],
//   //   });
  
//   //   await actionSheet.present();
//   // }

//   // async openActionSheet(rows: any[]) {
//   //   // Prepare a clean, single-line summary of each row
//   //   const formattedEntries = rows.map(row => {
//   //     const productName = this.getProductName(row);
//   //     const quantity = row.quantity || 0;
//   //     const price = row.price || 0;
      
//   //     return `#${row.serialNumber}: ${productName} | Qty: ${quantity} | Price: ${price}`;
//   //   });
    
//   //   // Create buttons for each entry plus the action buttons
//   //   const buttons = [
//   //     ...formattedEntries.map(entry => ({
//   //       text: entry,
//   //       role: 'info', // This is a non-action role
//   //       handler: () => { return false; } // Prevent dismiss on these items
//   //     })),
//   //     {
//   //       text: 'Submit',
//   //       icon: 'checkmark',
//   //       handler: () => {
//   //         this.submitSales();
//   //       }
//   //     },
//   //     {
//   //       text: 'Cancel',
//   //       icon: 'close',
//   //       role: 'cancel'
//   //     }
//   //   ];
    
//   //   const actionSheet = await this.actionSheetCtrl.create({
//   //     header: 'Preview Sales Entries',
//   //     buttons: buttons
//   //   });
    
//   //   await actionSheet.present();
//   // }
  
//   // // Helper method to get product name
//   // getProductName(row: any): string {
//   //   const productId = this.selectedProducts[row.serialNumber];
//   //   if (!productId) return 'No product selected';
    
//   //   const product = this.products.find(p => p.id === productId);
//   //   return product ? (product.name || product.product_name) : 'Unknown product';
//   // }

//   async openActionSheet(rows: any[]) {
//     // Prepare a clean, single-line summary of each row with icons
//     const formattedEntries = rows.map(row => {
//       const productName = this.getProductName(row);
//       const quantity = row.quantity || 0;
//       const price = row.price || 0;
      
//       return {
//         text: `${productName} | Qty: ${quantity} | Price: ${price}`,
//         icon: 'pricetag-outline', // Or any other Ionic icon that represents a product
//         role: 'info', // This is a non-action role
//         handler: () => { return false; } // Prevent dismiss on these items
//       };
//     });
    
//     // Create buttons for each entry plus the action buttons
//     const buttons = [
//       {
//         text: 'Cancel',
//         icon: 'close',
//         cssClass: 'cancel-action',
//         role: 'cancel'
//       },
//       ...formattedEntries,
//       {
//         text: 'Confirm Submit',
//         icon: 'checkmark',
//         cssClass: 'success-action',
//         handler: () => {
//           this.submitSales();
//         }
//       }
      
//     ];
    
//     const actionSheet = await this.actionSheetCtrl.create({
//       header: 'Preview Sales Entries',
//       buttons: buttons
//     });
    
//     await actionSheet.present();
//   }
  
//   // Helper method to get product name
//   getProductName(row: any): string {
//     const productId = this.selectedProducts[row.serialNumber];
//     if (!productId) return 'No product selected';
    
//     const product = this.products.find(p => p.id === productId);
//     return product ? (product.name || product.product_name) : 'Unknown product';
//   }
  
  

//   roleId: string | null = null;
//   lang: string | null = null;
//   cid: string | null = null;
//   errorMessage: string | null = null;
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
//     this.initializeRows();
//     this.fetchAllCategories();
//     this.fetchAllRetailers();
//     this.fetchAllOutlets();
//   }

//   selectedProducts: { [key: number]: any } = {}; // To track selected products by row ID
//   onProductSelected(event: { productId: any, rowId: number }) {
//     const { productId, rowId } = event;
//     this.selectedProducts[rowId] = productId.id;

//     // Log the selected product and row ID
//     console.log('Selected Product ID:', productId);
//     console.log('Row ID:', rowId);

//     // Optionally, log the entire selected products object for debugging
//     console.log('All Selected Products:', this.selectedProducts);

//   }

//   fetchUserData() {
//     const userIdString = localStorage.getItem('userId');
//     const userId = userIdString ? Number(userIdString) : null;
//     this.userIdfromlocal = userId;
//        // const roleId = localStorage.getItem('roleId');
//        const roleId = this.roleId;

//     if (userId !== null) {
//       // Check if roleId is '1' (superadmin)
//       if (roleId === '1') {
//         console.log('Superadmin detected');
//       } else {
//         this.userService.fetchUserData(userId).subscribe(
//           (response) => {
//             // Check if response is valid and has a message property
//             if (response && response.status) {
//               this.setUserData(response.data);
//               // console.log(response.data);
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
//         this.useroutlet = Number(outlet.id);
//         console.log("storeid", this.useroutlet);
//       } else {
//         // No matching outlet found
//         console.log('No matching outlet found for the given store name and retailer ID');
//       }
//     } else {
//       // No matching retailer found
//       console.log('No matching retailer found for the given retailer name');
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


//   initializeRows() {
//     this.tableRows = [
//       { serialNumber: 1, selectedProduct: null },
//       { serialNumber: 2, selectedProduct: null },
//       { serialNumber: 3, selectedProduct: null },
//       { serialNumber: 4, selectedProduct: null }
//     ];
//   }



//   addRow() {
//     const newSerialNumber = this.tableRows.length + 1;
//     this.tableRows.push({ serialNumber: newSerialNumber });
//   }

//   // deleteRow(){
//   //   // const newSerialNumber = this.tableRows.length + 1;
//   //   this.tableRows.pop();
//   // }

//   deleteRow() {
//     if (this.tableRows.length > 1) {
//       this.tableRows.pop(); 
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

//   async onCategoryChange(categoryId: number) {
//     if (categoryId) {
//       // console.log("catid on change",categoryId);

//       // this.usercategory = categoryId;

//       this.fetchProductsByCategory(categoryId);
//     } else {
//       // Reset all dependent dropdowns if no category is selected
//       // this.usercategory = null;
//     }
//   }

//   fetchProductsByCategory(categoryId: number) {
//     this.apiService.getProductsByCategory(categoryId).subscribe(
//       (response) => {
//         if (response.status) {
//           this.products = response.data; // Store fetched products
//           console.log(this.products);
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

//   async submitSales() {
//     // Validate required fields
//     if (!this.selectedFromDate) {
//       this.showAlert('Error', 'Please select a date.');
//       return;
//     }

//     if (!this.selectedCategory) {
//       this.showAlert('Error', 'Please select a category.');
//       return;
//     }

//     const hasInvalidRows = this.tableRows.some(row => {
//       return !this.selectedProducts[row.serialNumber] || row.quantity <= 0 || row.price <= 0;
//     });

//     if (hasInvalidRows) {
//       this.showAlert('Error', 'Please ensure all rows have a selected model, quantity, and price greater than zero.');
//       return;
//     }

//     const alert = await this.alertController.create({
//       header: 'Confirm Submission',
//       message: 'Are you sure you want to submit the sales data?',
//       buttons: [
//         {
//           text: 'Cancel',
//           role: 'cancel',
//           cssClass: 'secondary',
//           handler: () => {
//             console.log('Submission canceled');
//           }
//         },
//         {
//           text: 'Confirm',
//           handler: () => {
//             // Proceed with submission
//             const saleData = {
//               userId: this.userIdfromlocal,
//               storeId: this.useroutlet,
//               categoryId: Number(this.selectedCategory?.id),
//               saleDate: this.selectedFromDate,
//               models: this.tableRows.map(row => ({
//                 // id: row.selectedProduct?.id,
//                 id: this.selectedProducts[row.serialNumber],
//                 quantity: row.quantity || 0,
//                 price: row.price || 0
//               })).filter(model => model.id)
//             };

//             console.log("salesdata", saleData);

//             this.apiService.submitSales(saleData).subscribe(
//               response => {
//                 if (response.status) {
//                   console.log('Sales data submitted successfully:', response.data);
//                   // Reset fields upon successful submission
//                   this.resetFields();
//                   this.presentToast();
//                 } else {
//                   console.error('Failed to submit sales data:', response.message);
//                 }
//               },
//               error => {
//                 console.error('Error submitting sales data:', error);
//               }
//             );
//           }
//         }
//       ]
//     });

//     await alert.present();
//   }

//   // Method to reset all fields
//   resetFields() {
//     this.selectedFromDate = null;
//     this.selectedCategory = null;
//     this.products = [];
//     this.initializeRows();
//   }

//   // Helper method to show alert messages
//   async showAlert(header: string, message: string) {
//     const alert = await this.alertController.create({
//       header,
//       message,
//       buttons: ['OK']
//     });

//     await alert.present();
//   }

//   async presentToast() {
//     const toast = await this.toastController.create({
//       message: 'Data submitted successfully!',
//       duration: 2000,
//       position: 'bottom',
//       color: 'success',
//       cssClass: 'custom-toast'
//     });
//     await toast.present();
//   }

// }

// import { Component, OnInit, ViewChild } from '@angular/core';
// import { ActionSheetController, AlertController, IonPopover, ModalController, ToastController } from '@ionic/angular';
// import { ApiService } from 'src/app/services/api.service';
// import { AuthService } from 'src/app/services/auth.service';
// import { UserService } from 'src/app/services/user.service';

// @Component({
//   selector: 'app-upload-your-sales',
//   templateUrl: './upload-your-sales.page.html',
//   styleUrls: ['./upload-your-sales.page.scss'],
// })
// export class UploadYourSalesPage implements OnInit {

//   @ViewChild('fromPopover') fromPopover?: IonPopover;

//   isFromPopoverOpen: boolean = false;
//   selectedFromDate: string | null = null;
//   categories: any[] = [];
//   products: any[] = [];
//   alloutlets: any[] = [];
//   allretailers: any[] = [];
//   userIdfromlocal: any;


//   selectedCategory: any;
//   selectedProduct: any;
//   useroutlet: any;

//   onFromDateChange(event: any) {
//     // Get the full date from the event
//     const fullDate = new Date(event.detail.value);
//     const year = fullDate.getFullYear();
//     const month = String(fullDate.getMonth() + 1).padStart(2, '0');
//     const day = String(fullDate.getDate()).padStart(2, '0');

//     this.selectedFromDate = `${year}-${month}-${day}`;
//     this.fromPopover?.dismiss();
//   }


//   tableRows: any[] = [];

//   constructor(private actionSheetCtrl:ActionSheetController,private authservice:AuthService,private alertController: AlertController, private apiService: ApiService, private userService: UserService, private toastController: ToastController) { }

//   ngOnInit() {
//     this.getUserRole();
//   }

//   // async openActionSheet(row: any) {
    
  
//   //   const actionSheet = await this.actionSheetCtrl.create({
//   //     header: 'Preview Sales Entry',
//   //     subHeader: `
        
//   //         ${row.serialNumber}
             
            
//   //     `,
//   //     buttons: [
//   //       {
//   //         text: 'Submit',
//   //         icon: 'checkmark',
//   //         handler: () => {
//   //           // this.submitRow(row);
//   //         },
//   //       },
//   //       {
//   //         text: 'Cancel',
//   //         icon: 'close',
//   //         role: 'cancel',
//   //       },
//   //     ],
//   //   });
  
//   //   await actionSheet.present();
//   // }

//   // async openActionSheet(rows: any[]) {
//   //   // Prepare a clean, single-line summary of each row
//   //   const formattedEntries = rows.map(row => {
//   //     const productName = this.getProductName(row);
//   //     const quantity = row.quantity || 0;
//   //     const price = row.price || 0;
      
//   //     return `#${row.serialNumber}: ${productName} | Qty: ${quantity} | Price: ${price}`;
//   //   });
    
//   //   // Create buttons for each entry plus the action buttons
//   //   const buttons = [
//   //     ...formattedEntries.map(entry => ({
//   //       text: entry,
//   //       role: 'info', // This is a non-action role
//   //       handler: () => { return false; } // Prevent dismiss on these items
//   //     })),
//   //     {
//   //       text: 'Submit',
//   //       icon: 'checkmark',
//   //       handler: () => {
//   //         this.submitSales();
//   //       }
//   //     },
//   //     {
//   //       text: 'Cancel',
//   //       icon: 'close',
//   //       role: 'cancel'
//   //     }
//   //   ];
    
//   //   const actionSheet = await this.actionSheetCtrl.create({
//   //     header: 'Preview Sales Entries',
//   //     buttons: buttons
//   //   });
    
//   //   await actionSheet.present();
//   // }
  
//   // // Helper method to get product name
//   // getProductName(row: any): string {
//   //   const productId = this.selectedProducts[row.serialNumber];
//   //   if (!productId) return 'No product selected';
    
//   //   const product = this.products.find(p => p.id === productId);
//   //   return product ? (product.name || product.product_name) : 'Unknown product';
//   // }

//   // async openActionSheet(rows: any[]) {
//   //   // Prepare a clean, single-line summary of each row with icons
//   //   const formattedEntries = rows.map(row => {
//   //     const productName = this.getProductName(row);
//   //     const quantity = row.quantity || 0;
//   //     const price = row.price || 0;
      
//   //     return {
//   //       text: `${productName} | Qty: ${quantity} | Price: ${price}`,
//   //       icon: 'pricetag-outline', // Or any other Ionic icon that represents a product
//   //       role: 'info', // This is a non-action role
//   //       handler: () => { return false; } // Prevent dismiss on these items
//   //     };
//   //   });
    
//   //   // Create buttons for each entry plus the action buttons
//   //   const buttons = [
//   //     {
//   //       text: 'Cancel',
//   //       icon: 'close',
//   //       cssClass: 'cancel-action',
//   //       role: 'cancel'
//   //     },
//   //     ...formattedEntries,
//   //     // {
//   //     //   text: 'Confirm Submit',
//   //     //   icon: 'checkmark',
//   //     //   cssClass: 'success-action',
//   //     //   handler: () => {
//   //     //     this.submitSales();
//   //     //   }
//   //     // }
      
//   //   ];
    
//   //   const actionSheet = await this.actionSheetCtrl.create({
//   //     header: 'Preview Sales Entries',
//   //     buttons: buttons
//   //   });
    
//   //   await actionSheet.present();
//   // }

//   async openActionSheet(rows: any[]) {
//     const formattedEntries = rows.map((row, index) => {
//       const productName = this.getProductName(row);
//       const quantity = row.quantity || 0;
//       const price = row.price || 0;
  
//       return {
//         text: `${index + 1}. ${productName} — Qty: ${quantity}, ₹${price}`,
//         icon: 'cube-outline',
//         role: 'info',
//         cssClass: 'entry-item',
//         handler: () => false
//       };
//     });
  
//     const buttons = [
//       ...formattedEntries,
//       // {
//       //   text: 'Submit Sales',
//       //   icon: 'checkmark-circle',
//       //   cssClass: 'submit-action',
//       //   handler: () => this.submitSales()
//       // },
//       {
//         text: 'Cancel',
//         icon: 'close-circle',
//         cssClass: 'cancel-action',
//         role: 'cancel'
//       }
//     ];
  
//     const actionSheet = await this.actionSheetCtrl.create({
//       header: '🧾 Sales Preview',
//       buttons: buttons,
//       cssClass: 'custom-action-sheet'
//     });
  
//     await actionSheet.present();
//   }
  
  
//   // Helper method to get product name
//   getProductName(row: any): string {
//     const productId = this.selectedProducts[row.serialNumber];
//     if (!productId) return 'No product selected';
    
//     const product = this.products.find(p => p.id === productId);
//     return product ? (product.name || product.product_name) : 'Unknown product';
//   }
  
  

//   roleId: string | null = null;
//   lang: string | null = null;
//   cid: string | null = null;
//   errorMessage: string | null = null;
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
//     this.initializeRows();
//     this.fetchAllCategories();
//     this.fetchAllRetailers();
//     this.fetchAllOutlets();
//   }

//   selectedProducts: { [key: number]: any } = {}; // To track selected products by row ID
//   onProductSelected(event: { productId: any, rowId: number }) {
//     const { productId, rowId } = event;
//     this.selectedProducts[rowId] = productId.id;

//     // Log the selected product and row ID
//     console.log('Selected Product ID:', productId);
//     console.log('Row ID:', rowId);

//     // Optionally, log the entire selected products object for debugging
//     console.log('All Selected Products:', this.selectedProducts);

//   }

//   fetchUserData() {
//     const userIdString = localStorage.getItem('userId');
//     const userId = userIdString ? Number(userIdString) : null;
//     this.userIdfromlocal = userId;
//        // const roleId = localStorage.getItem('roleId');
//        const roleId = this.roleId;

//     if (userId !== null) {
//       // Check if roleId is '1' (superadmin)
//       if (roleId === '1') {
//         console.log('Superadmin detected');
//       } else {
//         this.userService.fetchUserData(userId).subscribe(
//           (response) => {
//             // Check if response is valid and has a message property
//             if (response && response.status) {
//               this.setUserData(response.data);
//               // console.log(response.data);
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
//         this.useroutlet = Number(outlet.id);
//         console.log("storeid", this.useroutlet);
//       } else {
//         // No matching outlet found
//         console.log('No matching outlet found for the given store name and retailer ID');
//       }
//     } else {
//       // No matching retailer found
//       console.log('No matching retailer found for the given retailer name');
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


//   initializeRows() {
//     this.tableRows = [
//       { serialNumber: 1, selectedProduct: null },
//       { serialNumber: 2, selectedProduct: null },
//       { serialNumber: 3, selectedProduct: null },
//       { serialNumber: 4, selectedProduct: null }
//     ];
//   }



//   addRow() {
//     const newSerialNumber = this.tableRows.length + 1;
//     this.tableRows.push({ serialNumber: newSerialNumber });
//   }

//   // deleteRow(){
//   //   // const newSerialNumber = this.tableRows.length + 1;
//   //   this.tableRows.pop();
//   // }

//   deleteRow() {
//     if (this.tableRows.length > 1) {
//       this.tableRows.pop(); 
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

//   async onCategoryChange(categoryId: number) {
//     if (categoryId) {
//       // console.log("catid on change",categoryId);

//       // this.usercategory = categoryId;

//       this.fetchProductsByCategory(categoryId);
//     } else {
//       // Reset all dependent dropdowns if no category is selected
//       // this.usercategory = null;
//     }
//   }

//   fetchProductsByCategory(categoryId: number) {
//     this.apiService.getProductsByCategory(categoryId).subscribe(
//       (response) => {
//         if (response.status) {
//           this.products = response.data; // Store fetched products
//           console.log(this.products);
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

//   async submitSales() {
//     // Validate required fields
//     if (!this.selectedFromDate) {
//       this.showAlert('Alert', 'Please select a date.');
//       return;
//     }

//     if (!this.selectedCategory) {
//       this.showAlert('Alert', 'Please select a category.');
//       return;
//     }

//     const hasInvalidRows = this.tableRows.some(row => {
//       return !this.selectedProducts[row.serialNumber] || row.quantity <= 0 || row.price <= 0;
//     });

//     if (hasInvalidRows) {
//       this.showAlert('Alert', 'Please ensure all rows have a selected model, quantity, and price greater than zero.');
//       return;
//     }

//     const alert = await this.alertController.create({
//       header: 'Confirm Submission',
//       message: 'Are you sure you want to submit the sales data?',
//       buttons: [
//         {
//           text: 'Cancel',
//           role: 'cancel',
//           cssClass: 'secondary',
//           handler: () => {
//             console.log('Submission canceled');
//           }
//         },
//         {
//           text: 'Confirm',
//           handler: () => {
//             // Proceed with submission
//             const saleData = {
//               userId: this.userIdfromlocal,
//               storeId: this.useroutlet,
//               categoryId: Number(this.selectedCategory?.id),
//               saleDate: this.selectedFromDate,
//               models: this.tableRows.map(row => ({
//                 // id: row.selectedProduct?.id,
//                 id: this.selectedProducts[row.serialNumber],
//                 quantity: row.quantity || 0,
//                 price: row.price || 0
//               })).filter(model => model.id)
//             };

//             console.log("salesdata", saleData);

//             this.apiService.submitSales(saleData).subscribe(
//               response => {
//                 if (response.status) {
//                   console.log('Sales data submitted successfully:', response.data);
//                   // Reset fields upon successful submission
//                   this.resetFields();
//                   this.presentToast();
//                 } else {
//                   console.error('Failed to submit sales data:', response.message);
//                 }
//               },
//               error => {
//                 console.error('Error submitting sales data:', error);
//               }
//             );
//           }
//         }
//       ]
//     });

//     await alert.present();
//   }

//   // Method to reset all fields
//   resetFields() {
//     this.selectedFromDate = null;
//     this.selectedCategory = null;
//     this.products = [];
//     this.initializeRows();
//   }

//   // Helper method to show alert messages
//   async showAlert(header: string, message: string) {
//     const alert = await this.alertController.create({
//       header,
//       message,
//       buttons: ['OK']
//     });

//     await alert.present();
//   }

//   async presentToast() {
//     const toast = await this.toastController.create({
//       message: 'Data submitted successfully!',
//       duration: 2000,
//       position: 'bottom',
//       color: 'success',
//       cssClass: 'custom-toast'
//     });
//     await toast.present();
//   }

// }

import { Component, OnInit, ViewChild } from '@angular/core';
import { ActionSheetController, AlertController, IonPopover, ModalController, ToastController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-upload-your-sales',
  templateUrl: './upload-your-sales.page.html',
  styleUrls: ['./upload-your-sales.page.scss'],
})
export class UploadYourSalesPage implements OnInit {

  @ViewChild('fromPopover') fromPopover?: IonPopover;

  isFromPopoverOpen: boolean = false;
  selectedFromDate: string | null = null;
  categories: any[] = [];
  products: any[] = [];
  alloutlets: any[] = [];
  allretailers: any[] = [];
  userIdfromlocal: any;


  selectedCategory: any;
  selectedProduct: any;
  useroutlet: any;

  onFromDateChange(event: any) {
    // Get the full date from the event
    const fullDate = new Date(event.detail.value);
    const year = fullDate.getFullYear();
    const month = String(fullDate.getMonth() + 1).padStart(2, '0');
    const day = String(fullDate.getDate()).padStart(2, '0');

    this.selectedFromDate = `${year}-${month}-${day}`;
    this.fromPopover?.dismiss();
  }


  tableRows: any[] = [];

  constructor(private actionSheetCtrl:ActionSheetController,private authservice:AuthService,private alertController: AlertController, private apiService: ApiService, private userService: UserService, private toastController: ToastController) { }

  ngOnInit() {
    this.getUserRole();
  }

  // async openActionSheet(row: any) {
    
  
  //   const actionSheet = await this.actionSheetCtrl.create({
  //     header: 'Preview Sales Entry',
  //     subHeader: `
        
  //         ${row.serialNumber}
             
            
  //     `,
  //     buttons: [
  //       {
  //         text: 'Submit',
  //         icon: 'checkmark',
  //         handler: () => {
  //           // this.submitRow(row);
  //         },
  //       },
  //       {
  //         text: 'Cancel',
  //         icon: 'close',
  //         role: 'cancel',
  //       },
  //     ],
  //   });
  
  //   await actionSheet.present();
  // }

  // async openActionSheet(rows: any[]) {
  //   // Prepare a clean, single-line summary of each row
  //   const formattedEntries = rows.map(row => {
  //     const productName = this.getProductName(row);
  //     const quantity = row.quantity || 0;
  //     const price = row.price || 0;
      
  //     return `#${row.serialNumber}: ${productName} | Qty: ${quantity} | Price: ${price}`;
  //   });
    
  //   // Create buttons for each entry plus the action buttons
  //   const buttons = [
  //     ...formattedEntries.map(entry => ({
  //       text: entry,
  //       role: 'info', // This is a non-action role
  //       handler: () => { return false; } // Prevent dismiss on these items
  //     })),
  //     {
  //       text: 'Submit',
  //       icon: 'checkmark',
  //       handler: () => {
  //         this.submitSales();
  //       }
  //     },
  //     {
  //       text: 'Cancel',
  //       icon: 'close',
  //       role: 'cancel'
  //     }
  //   ];
    
  //   const actionSheet = await this.actionSheetCtrl.create({
  //     header: 'Preview Sales Entries',
  //     buttons: buttons
  //   });
    
  //   await actionSheet.present();
  // }
  
  // // Helper method to get product name
  // getProductName(row: any): string {
  //   const productId = this.selectedProducts[row.serialNumber];
  //   if (!productId) return 'No product selected';
    
  //   const product = this.products.find(p => p.id === productId);
  //   return product ? (product.name || product.product_name) : 'Unknown product';
  // }

  // async openActionSheet(rows: any[]) {
  //   // Prepare a clean, single-line summary of each row with icons
  //   const formattedEntries = rows.map(row => {
  //     const productName = this.getProductName(row);
  //     const quantity = row.quantity || 0;
  //     const price = row.price || 0;
      
  //     return {
  //       text: `${productName} | Qty: ${quantity} | Price: ${price}`,
  //       icon: 'pricetag-outline', // Or any other Ionic icon that represents a product
  //       role: 'info', // This is a non-action role
  //       handler: () => { return false; } // Prevent dismiss on these items
  //     };
  //   });
    
  //   // Create buttons for each entry plus the action buttons
  //   const buttons = [
  //     {
  //       text: 'Cancel',
  //       icon: 'close',
  //       cssClass: 'cancel-action',
  //       role: 'cancel'
  //     },
  //     ...formattedEntries,
  //     // {
  //     //   text: 'Confirm Submit',
  //     //   icon: 'checkmark',
  //     //   cssClass: 'success-action',
  //     //   handler: () => {
  //     //     this.submitSales();
  //     //   }
  //     // }
      
  //   ];
    
  //   const actionSheet = await this.actionSheetCtrl.create({
  //     header: 'Preview Sales Entries',
  //     buttons: buttons
  //   });
    
  //   await actionSheet.present();
  // }

  async openActionSheet(rows: any[]) {
    const formattedEntries = rows.map((row, index) => {
      const productName = this.getProductName(row);
      const quantity = row.quantity || 0;
      const price = row.price || 0;
  
      return {
        text: `${index + 1}. ${productName} — Qty: ${quantity}, ${price}`,
        icon: 'cube-outline',
        role: 'info',
        cssClass: 'entry-item',
        handler: () => false
      };
    });
  
    const buttons = [
      ...formattedEntries,
      // {
      //   text: 'Submit Sales',
      //   icon: 'checkmark-circle',
      //   cssClass: 'submit-action',
      //   handler: () => this.submitSales()
      // },
      {
        text: 'Cancel',
        icon: 'close-circle',
        cssClass: 'cancel-action',
        role: 'cancel'
      }
    ];
  
    const actionSheet = await this.actionSheetCtrl.create({
      header: '🧾 Sales Preview',
      buttons: buttons,
      cssClass: 'custom-action-sheet'
    });
  
    await actionSheet.present();
  }
  
  
  // Helper method to get product name
  getProductName(row: any): string {
    const productId = this.selectedProducts[row.serialNumber];
    if (!productId) return 'No product selected';
    
    const product = this.products.find(p => p.id === productId);
    return product ? (product.name || product.product_name) : 'Unknown product';
  }
  
  

  roleId: string | null = null;
  lang: string | null = null;
  cid: string | null = null;
  errorMessage: string | null = null;
  getUserRole() {
    const UserId = localStorage.getItem('userId');
    if (UserId) {
      this.authservice.getUserRole(UserId).subscribe({
        next: (response) => {
          if (response.status) {
            this.roleId = response.data.role_id; 
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
    this.initializeRows();
    this.fetchAllCategories();
    this.fetchAllRetailers();
    this.fetchAllOutlets();
  }

  selectedProducts: { [key: number]: any } = {}; // To track selected products by row ID
  // onProductSelected(event: { productId: any, rowId: number }) {
  //   const { productId, rowId } = event;
  //   this.selectedProducts[rowId] = productId.id;

  //   // Log the selected product and row ID
  //   console.log('Selected Product ID:', productId);
  //   console.log('Row ID:', rowId);

  //   // Optionally, log the entire selected products object for debugging
  //   console.log('All Selected Products:', this.selectedProducts);

  // }

  // onProductSelected(event: { productId: any, rowId: number }) {
  //   const { productId, rowId } = event;
  //   const index = rowId - 1;
  
  //   if (!this.tableRows[index]) {
  //     console.error(`Row with ID ${rowId} does not exist in tableRows.`);
  //     return;
  //   }
  
  //   const isDuplicate = this.tableRows.some((row, i) =>
  //     i !== index && row.selectedProduct?.id === productId.id
  //   );
  
  //   if (isDuplicate) {
  //     this.tableRows[index].selectedProduct = null;
  
  //     // ✅ Show Ionic alert
  //     this.showDuplicateAlert(productId.name);
  //     return;
  //   }
  
  //   this.tableRows[index].selectedProduct = productId;
  // }

  onProductSelected(event: { productId: any, rowId: number }) {
    const { productId, rowId } = event;
    const index = rowId - 1;
  
    if (!this.tableRows[index]) {
      console.error(`Row with ID ${rowId} does not exist in tableRows.`);
      return;
    }
  
    const isDuplicate = this.tableRows.some((row, i) =>
      i !== index && row.selectedProduct?.id === productId.id
    );
  
    if (isDuplicate) {
      this.tableRows[index].selectedProduct = null;
  
      // ✅ Show Ionic alert
      this.showDuplicateAlert(productId.name);
      return;
    }
  
    this.tableRows[index].selectedProduct = productId;
  
    // ✅ Update selectedProducts map after successful selection
    this.selectedProducts[rowId] = productId.id;
  }
  

  async showDuplicateAlert(productName: string) {
    const alert = await this.alertController.create({
      header: 'Duplicate Product',
      message: `The product "${productName}" is already selected in another row.`,
      buttons: ['OK']
    });
  
    await alert.present();
  }
  
  
  
  

  fetchUserData() {
    const userIdString = localStorage.getItem('userId');
    const userId = userIdString ? Number(userIdString) : null;
    this.userIdfromlocal = userId;
       // const roleId = localStorage.getItem('roleId');
       const roleId = this.roleId;

    if (userId !== null) {
      // Check if roleId is '1' (superadmin)
      if (roleId === '1') {
        console.log('Superadmin detected');
      } else {
        this.userService.fetchUserData(userId).subscribe(
          (response) => {
            // Check if response is valid and has a message property
            if (response && response.status) {
              this.setUserData(response.data);
              // console.log(response.data);
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
        this.useroutlet = Number(outlet.id);
        console.log("storeid", this.useroutlet);
      } else {
        // No matching outlet found
        console.log('No matching outlet found for the given store name and retailer ID');
      }
    } else {
      // No matching retailer found
      console.log('No matching retailer found for the given retailer name');
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


  // initializeRows() {
  //   this.tableRows = [
  //     { serialNumber: 1, selectedProduct: null },
  //     { serialNumber: 2, selectedProduct: null },
  //     { serialNumber: 3, selectedProduct: null },
  //     { serialNumber: 4, selectedProduct: null }
  //   ];
  // }

  initializeRows() {
    this.tableRows = [
      { serialNumber: 1, selectedProduct: null }
    ];
  }

  addRow() {
    const newSerialNumber = this.tableRows.length + 1;
    this.tableRows.push({ serialNumber: newSerialNumber });
  }

  // deleteRow(){
  //   // const newSerialNumber = this.tableRows.length + 1;
  //   this.tableRows.pop();
  // }

  deleteRow() {
    if (this.tableRows.length > 1) {
      this.tableRows.pop(); 
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

  async onCategoryChange(categoryId: number) {
    if (categoryId) {
      // console.log("catid on change",categoryId);

      // this.usercategory = categoryId;

      this.fetchProductsByCategory(categoryId);
    } else {
      // Reset all dependent dropdowns if no category is selected
      // this.usercategory = null;
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

  async submitSales() {
    // Validate required fields
    if (!this.selectedFromDate) {
      this.showAlert('Alert', 'Please select a date.');
      return;
    }

    if (!this.selectedCategory) {
      this.showAlert('Alert', 'Please select a category.');
      return;
    }

    const hasInvalidRows = this.tableRows.some(row => {
      return !this.selectedProducts[row.serialNumber] || row.quantity <= 0 || row.price <= 0;
    });

    if (hasInvalidRows) {
      this.showAlert('Alert', 'Please ensure all rows have a selected model, quantity, and price greater than zero.');
      return;
    }

    const alert = await this.alertController.create({
      header: 'Confirm Submission',
      message: 'Are you sure you want to submit the sales data?',
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
          text: 'Confirm',
          handler: () => {
            // Proceed with submission
            const saleData = {
              userId: this.userIdfromlocal,
              storeId: this.useroutlet,
              categoryId: Number(this.selectedCategory?.id),
              saleDate: this.selectedFromDate,
              models: this.tableRows.map(row => ({
                // id: row.selectedProduct?.id,
                id: this.selectedProducts[row.serialNumber],
                quantity: row.quantity || 0,
                price: row.price || 0
              })).filter(model => model.id)
            };

            console.log("salesdata", saleData);

            this.apiService.submitSales(saleData).subscribe(
              response => {
                if (response.status) {
                  console.log('Sales data submitted successfully:', response.data);
                  // Reset fields upon successful submission
                  this.resetFields();
                  this.presentToast();
                } else {
                  console.error('Failed to submit sales data:', response.message);
                }
              },
              error => {
                console.error('Error submitting sales data:', error);
              }
            );
          }
        }
      ]
    });

    await alert.present();
  }

  // Method to reset all fields
  resetFields() {
    this.selectedFromDate = null;
    this.selectedCategory = null;
    this.products = [];
    this.initializeRows();
  }

  // Helper method to show alert messages
  async showAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK']
    });

    await alert.present();
  }

  async presentToast() {
    const toast = await this.toastController.create({
      message: 'Data submitted successfully!',
      duration: 2000,
      position: 'bottom',
      color: 'success',
      cssClass: 'custom-toast'
    });
    await toast.present();
  }

}