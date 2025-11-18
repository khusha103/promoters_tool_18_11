// import { Component, OnInit } from '@angular/core';
// import { ActivatedRoute } from '@angular/router';
// import { AlertController } from '@ionic/angular';
// import { ApiService } from 'src/app/services/api.service';

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
//   selector: 'app-update-ranging-feedback',
//   templateUrl: './update-ranging-feedback.page.html',
//   styleUrls: ['./update-ranging-feedback.page.scss'],
// })
// export class UpdateRangingFeedbackPage implements OnInit {

//   selectedFile: File | null = null;
//   selectedFromDate!: string; 
//   isFromPopoverOpen: boolean = false; 
//   feedback: string = '';
//   outletid!: number;
//   catid!: number;
//   userid!: string;

  
//   selectedProduct: any; 
//   products: any[] = []; 
//   allproducts: any[] = []; 

//   getCategory_fromprevpage: string | undefined;

//   stockValue: number = 0; 
//   selectedCategoryName: string | null = null; 
//   showupdatefeedbackbtn: boolean = false;

//   feedbackData!: Feedback | null; 
//   errorMessage!: string | null;

//   constructor(private apiService: ApiService, private route: ActivatedRoute,private alertController: AlertController) { }

// selectedAttachment:any;
//   selectOption(option: any,extraParam: string) {
//     this.selectedAttachment = option;
//     console.log('Selected Attachment ID:', this.selectedAttachment?.id);
//     console.log('Extra Parameter:', extraParam);

// }
//   ngOnInit() {
//     this.route.queryParams.subscribe(params => {
//       const getCategory_fromprevpage = params['categoryId']; 
//       const getOutlet_fromprevpage = params['outletId']; 

//       const catid = Number(getCategory_fromprevpage);
//       const outletid = Number(getOutlet_fromprevpage);

//       this.catid = catid;
//       this.outletid = outletid;

//       if (!isNaN(catid)) {
//         this.fetchProductsByCategory(catid);
//         this.fetchCategoryName(catid); 
//       }

//       this.apiService.getLatestFeedback(catid, outletid).subscribe({
//         next: (response) => {
//           if (response.status) {
//             this.feedbackData = response.data;
//             console.log("feedback data",this.feedbackData);
//             this.errorMessage = null; 
//             this.showupdatefeedbackbtn = true;
//           } else {
//             this.feedbackData = null; 
//             this.errorMessage = response.message || 'No feedback available.';
//             this.showupdatefeedbackbtn = false;
//           }
//         },
//         error: (err) => {
//           console.error(err);
//           this.errorMessage = 'An error occurred while fetching feedback.';
//           this.showupdatefeedbackbtn = false;
//         }
//       });
//     });

//     this.fetchAllProducts(); 
//    }

//    fetchCategoryName(categoryId: number) {
//     this.apiService.getCategoryById(categoryId).subscribe(
//       (category) => {
//         this.selectedCategoryName = category.data; 
//       },
//       (error) => {
//         console.error('Error fetching category:', error);
//       }
//     );
//    }

//    onStockChange(newStockValue: string) {
//     console.log('Updated Stock Value:', newStockValue);
//    }

//   //  onFileSelected(event: any) {
//   //   const file: File = event.target.files[0];
//   //   if (file) {
//   //     this.selectedFile = file;
//   //     console.log('Selected file:', this.selectedFile);
//   //   }
//   //  }

//    openFromPopover() {
//     this.isFromPopoverOpen = true; 
//    }

//    closeFromPopover() {
//     this.isFromPopoverOpen = false; 
//    }

//    onFromDateChange(event: any) {
//     this.selectedFromDate = event.detail.value; 
//     this.closeFromPopover(); 
//    }

//    fetchProductsByCategory(categoryId: number) {
//     this.apiService.getProductsByCategory(categoryId).subscribe(
//       (response) => {
//         if (response.status) {
//           this.products = response.data; 
//         } else {
//           console.error('Failed to fetch products:', response.message);
//         }
//       },
//       (error) => {
//         console.error('Error fetching products:', error);
//         this.products = []; 
//       }
//     );
//    }

//    fetchAllProducts() {
//     this.apiService.getAllProducts().subscribe(
//       (response) => {
//         if (response.status) {
//           this.allproducts = response.data; 
//           // console.log(this.allproducts);
//         } else {
//           console.error('Failed to fetch products:', response.message);
//         }
//       },
//       (error) => {
//         console.error('Error fetching products:', error);
//         this.allproducts = []; 
//       }
//     );
//    }

//    addProduct() {
//     if (this.selectedProduct) {
//       const newDetail: FeedbackDetail = {
//         id: '', // Generate or assign an ID as needed
//         feedback_id: '', // Assign appropriate feedback ID if needed
//         product_id: this.selectedProduct.id, 
//         available: '0', 
//         open_display: '0', 
//         stock: '0', 
//         is_ranging: '0', 
//         attachment1_model_id: null,
//         attachment2_model_id: null,
//         attachment3_model_id: null,
//         product_name: this.selectedProduct.name,
//       };
  
//       // Check if feedbackData is null
//       if (!this.feedbackData) {
//         // Initialize feedbackData if it's null
//         const userIdString = localStorage.getItem('userId');
//         if(userIdString)
//         this.userid = userIdString;
//         this.feedbackData = {
//           id: '', // Assign appropriate ID if needed
//           user_id: this.userid, // Assign appropriate user ID if needed
//           store_id: String(this.outletid), // Assign appropriate store ID if needed
//           category_id: String(this.catid), // Assign appropriate category ID if needed
//           feedback: '',
//           feedback_date: '',
//           created_on: '',
//           store_name: '',
//           retailer_name: '',
//           details: [], // Initialize details as an empty array
//         };
//       }
  
//       // Now it's safe to push the new detail
//       this.feedbackData.details.push(newDetail); 
//       console.log('Added Product:', newDetail);
//       this.selectedProduct = null; // Reset selection
//     }
//   }

//   onProductSelected(productId: any) {
//     console.log('Selected Product ID:', productId);
//     if(productId){
//     this.selectedProduct = productId;

//     }
//   }

//   async submitFeedback() {
//     // Validate feedback text and feedback date
//     if (!this.feedback || !this.feedback.trim()) {
//         await this.presentAlert('Please provide feedback text before submitting.'); // Notify user to add feedback text
//         return;
//     }

//     const feedbackDate = this.selectedFromDate;
//     if (!feedbackDate) {
//         await this.presentAlert('Feedback date is required.'); // Notify user to add feedback date
//         return;
//     }

//     if (this.feedbackData && this.feedbackData.details.length > 0) {
//         // Construct the payload for submission
//         const userIdString = localStorage.getItem('userId');
//         if (userIdString) this.userid = userIdString;

//         const payload = {
//             user_id: this.userid,
//             store_id: String(this.outletid),
//             category_id: String(this.catid),
//             feedback_date: feedbackDate,
//             feedback_text: this.feedback,
//             details: this.transformDetails(this.feedbackData.details) // Transform details
//         };

//         console.log("payload", payload);

//         // Show confirmation alert
//         const confirmed = await this.presentConfirm('Confirm Submission', 'Are you sure you want to submit your feedback?');

//         if (confirmed) {
//             // Call the service to submit the feedback
//             this.apiService.submitFeedback(payload).subscribe({
//                 next: async (response) => {
//                     if (response.status) {
//                         console.log('Feedback submitted successfully:', response.data);
//                         await this.presentAlert('Thank you for your feedback!'); // Notify user of success
//                     } else {
//                         console.error('Failed to submit feedback:', response.message);
//                         await this.presentAlert('Error: ' + response.message); // Notify user of failure
//                     }
//                 },
//                 error: async (err) => {
//                     console.error('Error submitting feedback:', err);
//                     await this.presentAlert('An error occurred while submitting feedback. Please try again.'); // Notify user of error
//                 }
//             });
//         } else {
//             console.log('Feedback submission canceled by user.');
//         }
//     } else {
//         console.warn('No feedback details to submit.');
//         await this.presentAlert('Please add at least one product detail before submitting.'); // Notify user to add details
//     }
// }

// async presentConfirm(header: string, message: string): Promise<boolean> {
//     const alert = await this.alertController.create({
//         header: header,
//         message: message,
//         buttons: [
//             {
//                 text: 'Cancel',
//                 role: 'cancel',
//                 cssClass: 'secondary',
//                 handler: () => {
//                     console.log('User canceled submission');
//                     return false; // User canceled
//                 }
//             },
//             {
//                 text: 'Confirm',
//                 handler: () => {
//                     console.log('User confirmed submission');
//                     return true; // User confirmed
//                 }
//             }
//         ]
//     });

//     await alert.present();

//     const { role } = await alert.onDidDismiss(); // Wait for the alert to be dismissed

//     return role !== 'cancel'; // Return true if confirmed, false if canceled
// }

// async presentAlert(message: string) {
//     const alert = await this.alertController.create({
//         header: 'Notification',
//         message: message,
//         buttons: ['OK']
//     });

//     await alert.present();
// }


//   // Method to transform details into the desired format
// private transformDetails(details: any[]): any[] {
//   return details.map(detail => ({
//       product_id: detail.product_id, // Store product ID, not name
//       available: detail.available === "1" ? 1 : 0, // Convert string "1"/"0" to integer 1/0
//       open_display: detail.open_display === "1" ? 1 : 0, // Convert string "1"/"0" to integer 1/0
//       stock: parseInt(detail.stock, 10) || 0, // Ensure stock is an integer, defaulting to 0 if invalid
//       attachment1_model_id: detail.attachment1_model_id || null,
//       attachment2_model_id: detail.attachment2_model_id || null,
//       attachment3_model_id: detail.attachment3_model_id || null,
//   }));
// }

// // Convert '1' or '0' to boolean
// isAvailable(value: string): boolean {
//   return value === '1';
// }

// // Update the 'available' value when the toggle is changed
// updateAvailable(detail: any, checked: boolean) {
//   detail.available = checked ? '1' : '0';
// }

// // Update the 'open_display' value when the toggle is changed
// updateOpenDisplay(detail: any, checked: boolean) {
//   detail.open_display = checked ? '1' : '0';
// }

// }


import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';

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
  feedback:string | null;
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


export interface ColumnVisibility {
  productId: boolean;
  availableBoxDisplay: boolean;
  availableOpenDisplay: boolean;
  minStockLevel: boolean;
  stock: boolean;
  lastUpdate: boolean;
  attachment1: boolean;
  attachment2: boolean;
  attachment3: boolean;
  feedback: boolean;
}


@Component({
  selector: 'app-update-ranging-feedback',
  templateUrl: './update-ranging-feedback.page.html',
  styleUrls: ['./update-ranging-feedback.page.scss'],
})
export class UpdateRangingFeedbackPage implements OnInit {

  selectedFile: File | null = null;
  selectedFromDate!: string; 
  isFromPopoverOpen: boolean = false; 
  feedback: string = '';
  outletid!: number;
  catid!: number;
  userid!: string;

  
  selectedProduct: any; 
  products: any[] = []; 
  allproducts: any[] = []; 

  getCategory_fromprevpage: string | undefined;

  stockValue: number = 0; 
  selectedCategoryName: string | null = null; 
  showupdatefeedbackbtn: boolean = false;

  feedbackData!: Feedback | null; 
  errorMessage!: string | null;

  columnVisibility: ColumnVisibility = {
    productId: false,
    availableBoxDisplay: false,
    availableOpenDisplay: false,
    minStockLevel: false,
    stock: false,
    lastUpdate: false,
    attachment1: false,
    attachment2: false,
    attachment3: false,
    feedback: false,
  };

  constructor(private apiService: ApiService, private route: ActivatedRoute,private alertController: AlertController,private authservice:AuthService) { }

selectedAttachment:any;
  selectOption(option: any,extraParam: string) {
    this.selectedAttachment = option;
    console.log('Selected Attachment ID:', this.selectedAttachment?.id);
    console.log('Extra Parameter:', extraParam);

}
//   ngOnInit() {
//     this.route.queryParams.subscribe(params => {
//       const getCategory_fromprevpage = params['categoryId']; 
//       const getOutlet_fromprevpage = params['outletId']; 

//       const catid = Number(getCategory_fromprevpage);
//       const outletid = Number(getOutlet_fromprevpage);

//       this.catid = catid;
//       this.outletid = outletid;

//       if (!isNaN(catid)) {
//         this.fetchProductsByCategory(catid);
//         this.fetchCategoryName(catid); 
//       }

//       //create function for below fucntionality so that not show code in onitit basically only call function 
//       this.apiService.getLatestFeedback(catid, outletid).subscribe({
//         next: (response) => {
//           if (response.status) {
//             this.feedbackData = response.data;
//             console.log("feedback data",this.feedbackData);
//             this.errorMessage = null; 
//             this.showupdatefeedbackbtn = true;
//             console.log("feedback det",this.feedbackData.details);
            
// this.calculateProgressPercentage(this.feedbackData.details);

//           } else {
//             this.feedbackData = null; 
//             this.errorMessage = response.message || 'No feedback available.';
//             this.showupdatefeedbackbtn = false;
//           }
//         },
//         error: (err) => {
//           console.error(err);
//           this.errorMessage = 'An error occurred while fetching feedback.';
//           this.showupdatefeedbackbtn = false;
//         }
//       });
//     });

//     this.fetchAllProducts(); 
//    }

ngOnInit() {
  // this.subscribeToQueryParams();
  this.getUserRole();
  // this.fetchColumnVisibility();
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
          //when get roleid then call methods
          this.subscribeToQueryParams();
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
userRole:any;
// Abstract query parameter subscription logic
private subscribeToQueryParams(): void {
  this.route.queryParams.subscribe(params => {
    const catid = Number(params['categoryId']);
    const outletid = Number(params['outletId']);

    this.catid = catid;
    this.outletid = outletid;
    // this.userRole = Number(localStorage.getItem('roleId'));
    this.userRole = Number(this.roleId);

    this.fetchColumnVisibility(this.userRole, this.catid);

    this.initializePage(catid, outletid);
  });
}

fetchColumnVisibility(userRole: number, catId: number) {
  this.apiService.getColumnVisibilityData(userRole, catId).subscribe((response) => {
    if (response.status) {
      const data = response.data[0];
        this.columnVisibility.productId = data.product !== "0";
        this.columnVisibility.availableBoxDisplay = data.available_box_display  !== "0";
        this.columnVisibility.availableOpenDisplay = data.available_open_display === "1";
        this.columnVisibility.minStockLevel = data.min_stock_level === "1"; 
        this.columnVisibility.stock = data.stock === "1"; 
        this.columnVisibility.lastUpdate = true; 
        this.columnVisibility.attachment1 = data.attachment1_model === "1"; 
        this.columnVisibility.attachment2 = data.attachment2_model === "1"; 
        this.columnVisibility.attachment3 = data.attachment3_model === "1"; 
        this.columnVisibility.feedback = data.feedback === "1"; 

        // console.log(this.columnVisibility);

    }
  });
}



// Initialize page-related functionality
private initializePage(catid: number, outletid: number): void {
  if (!isNaN(catid)) {
    this.fetchProductsByCategory(catid);
    this.fetchCategoryName(catid);
  }

  this.fetchFeedbackData(catid, outletid);
  this.fetchAllProducts();
}

// Fetch feedback data
feedback_id:any;
private fetchFeedbackData(catid: number, outletid: number): void {
  this.apiService.getLatestFeedback(catid, outletid).subscribe({
    next: (response) => {
      if (response.status) {
        this.feedbackData = response.data;
        // console.log("feedback data", this.feedbackData);
        this.errorMessage = null;
        this.showupdatefeedbackbtn = true;
        console.log("feedback det", this.feedbackData.details);
        // this.feedback_id = this.feedbackData.feedback_id;

        this.calculateProgressPercentage(this.feedbackData.details);
      } else {
        this.feedbackData = null;
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
    this.progressPercentage = totalEntries > 0 ? ((openDisplayCount) / totalEntries) * 100 : 0;

    // console.log("progress percent",this.progressPercentage);
  }

   fetchCategoryName(categoryId: number) {
    this.apiService.getCategoryById(categoryId).subscribe(
      (category) => {
        this.selectedCategoryName = category.data; 
      },
      (error) => {
        console.error('Error fetching category:', error);
      }
    );
   }

   onStockChange(newStockValue: string) {
    // console.log('Updated Stock Value:', newStockValue);
   }


   openFromPopover() {
    this.isFromPopoverOpen = true; 
   }

   closeFromPopover() {
    this.isFromPopoverOpen = false; 
   }

   onFromDateChange(event: any) {
    this.selectedFromDate = event.detail.value; 
    this.closeFromPopover(); 
   }

   fetchProductsByCategory(categoryId: number) {
    this.apiService.getProductsByCategory(categoryId).subscribe(
      (response) => {
        if (response.status) {
          this.products = response.data; 
        } else {
          console.error('Failed to fetch products:', response.message);
        }
      },
      (error) => {
        console.error('Error fetching products:', error);
        this.products = []; 
      }
    );
   }

  //  fetchAllProducts() {
  //   console.log(this.catid);
  //   this.apiService.getAllProducts().subscribe(
  //     (response) => {
  //       if (response.status) {
  //         this.allproducts = response.data; 
  //         // console.log(this.allproducts);
  //       } else {
  //         console.error('Failed to fetch products:', response.message);
  //       }
  //     },
  //     (error) => {
  //       console.error('Error fetching products:', error);
  //       this.allproducts = []; 
  //     }
  //   );
  //  }

  fetchAllProducts() {
    console.log(this.catid);
    this.apiService.getAttachmentsProductsByCategory(this.catid).subscribe(
      (response) => {
        if (response.status) {
          this.allproducts = response.data; 
          // console.log(this.allproducts);
        } else {
          console.error('Failed to fetch products:', response.message);
        }
      },
      (error) => {
        console.error('Error fetching products:', error);
        this.allproducts = []; 
      }
    );
   }

   addProduct() {
    if (this.selectedProduct) {
      const newDetail: FeedbackDetail = {
        id: '', // Generate or assign an ID as needed
        feedback_id: '', // Assign appropriate feedback ID if needed
        product_id: this.selectedProduct.id, 
        available: '0', 
        open_display: '0', 
        stock: '0', 
        is_ranging: '0', 
        attachment1_model_id: null,
        attachment2_model_id: null,
        attachment3_model_id: null,
        product_name: this.selectedProduct.name,
        feedback:''

      };
  
      // Check if feedbackData is null
      if (!this.feedbackData) {
        // Initialize feedbackData if it's null
        const userIdString = localStorage.getItem('userId');
        if(userIdString)
        this.userid = userIdString;
        this.feedbackData = {
          id: '', // Assign appropriate ID if needed
          user_id: this.userid, // Assign appropriate user ID if needed
          store_id: String(this.outletid), // Assign appropriate store ID if needed
          category_id: String(this.catid), // Assign appropriate category ID if needed
          feedback: '',
          feedback_date: '',
          created_on: '',
          store_name: '',
          retailer_name: '',
          details: [], // Initialize details as an empty array
        };
      }
  
      // Now it's safe to push the new detail
      this.feedbackData.details.push(newDetail); 
      // console.log('Added Product:', newDetail);
      this.selectedProduct = null; // Reset selection
    }
  }

  onProductSelected(productId: any) {
    // console.log('Selected Product ID:', productId);
    if(productId){
    this.selectedProduct = productId;
    }
  }

  


    // // Method to calculate progress percentage
    // calculateProgressPercentage(details: any[]): void {
    //   const totalEntries = details.length;
    //   const openDisplayCount = details.filter(item => item.open_display === "1").length;
    //   const boxDisplayCount = details.filter(item => item.available === "1").length;
  
    //   // console.log("boxDisplayCount", boxDisplayCount);
  
    //   // Calculate percentage with correct operator precedence
    //   this.progressPercentage = totalEntries > 0 ? ((openDisplayCount + boxDisplayCount) / totalEntries) * 100 : 0;
    // }

    confirm_message:boolean =false;

  async submitFeedback() {
    // Validate feedback text and feedback date
    // if (!this.feedback || !this.feedback.trim()) {
    //     await this.presentAlert('Please provide feedback text before submitting.'); // Notify user to add feedback text
    //     return;
    // }

    // const feedbackDate = this.selectedFromDate;
    // if (!feedbackDate) {
    //     await this.presentAlert('Feedback date is required.'); // Notify user to add feedback date
    //     return;
    // }

    if (this.feedbackData && this.feedbackData.details.length > 0) {
        // Construct the payload for submission
        const userIdString = localStorage.getItem('userId');
        if (userIdString) this.userid = userIdString;

        // const payload = {
        //     user_id: this.userid,
        //     store_id: String(this.outletid),
        //     category_id: String(this.catid),
        //     feedback_date: feedbackDate,
        //     feedback_text: this.feedback,
        //     details: this.transformDetails(this.feedbackData.details) // Transform details
        // };

        const payload = {
          user_id: this.userid,
          store_id: String(this.outletid),
          category_id: String(this.catid),
          feedback_date: new Date().toISOString(), // if required we will capture this in backedn api acc to server timmming
          feedback_text: this.feedback || "",
          details: this.transformDetails(this.feedbackData.details) // Transform details
        };
        

        console.log("payload", payload);

        // Show confirmation alert

        if (!this.feedback || !this.feedback.trim()) {
          this.confirm_message = await this.presentConfirm('Confirm Submission', 'You have the option to provide feedback either for the model or in general. If you do not wish to provide feedback, click OK to proceed.');
          
          }else{

            this.confirm_message = await this.presentConfirm('Confirm Submission', 'Are you sure you want to submit your feedback?');
          }

        const confirmed = this.confirm_message;
        if (confirmed) {
            // Call the service to submit the feedback
            this.apiService.submitFeedback(payload).subscribe({
                next: async (response) => {
                    if (response.status) {
                        console.log('Feedback submitted successfully:', response.data);
                        await this.presentAlert('Thank you for your feedback!'); // Notify user of success
                    } else {
                        console.error('Failed to submit feedback:', response.message);
                        await this.presentAlert('Error: ' + response.message); // Notify user of failure
                    }
                },
                error: async (err) => {
                    console.error('Error submitting feedback:', err);
                    await this.presentAlert('An error occurred while submitting feedback. Please try again.'); // Notify user of error
                }
            });
        } else {
            console.log('Feedback submission canceled by user.');
        }
    } else {
        console.warn('No feedback details to submit.');
        await this.presentAlert('Please add at least one product detail before submitting.'); // Notify user to add details
    }
}


async WIPsubmitFeedback() {
  if (this.feedbackData && this.feedbackData.details.length > 0) {
      // Construct the payload for submission
      const userIdString = localStorage.getItem('userId');
      if (userIdString) this.userid = userIdString;

      const payload = {
        user_id: this.userid,
        store_id: String(this.outletid),
        category_id: String(this.catid),
        feedback_date: new Date().toISOString(), // if required we will capture this in backedn api acc to server timmming
        feedback_text: this.feedback || "",
        details: this.transformDetails(this.feedbackData.details) // Transform details
      };
      

      console.log("payload", payload);

      // Show confirmation alert

      if (!this.feedback || !this.feedback.trim()) {
        this.confirm_message = await this.presentConfirm('Confirm Submission', 'You have the option to provide feedback either for the model or in general. If you do not wish to provide feedback, click OK to proceed.');
        
        }else{

          this.confirm_message = await this.presentConfirm('Confirm Submission', 'Are you sure you want to submit your feedback?');
        }

      const confirmed = this.confirm_message;
      if (confirmed) {
          // Call the service to submit the feedback
          // this.apiService.submitFeedback(payload).subscribe({
          //     next: async (response) => {
          //         if (response.status) {
          //             console.log('Feedback submitted successfully:', response.data);
          //             await this.presentAlert('Thank you for your feedback!'); // Notify user of success
          //         } else {
          //             console.error('Failed to submit feedback:', response.message);
          //             await this.presentAlert('Error: ' + response.message); // Notify user of failure
          //         }
          //     },
          //     error: async (err) => {
          //         console.error('Error submitting feedback:', err);
          //         await this.presentAlert('An error occurred while submitting feedback. Please try again.'); // Notify user of error
          //     }
          // });

          const alert = await this.alertController.create({
            header: 'Work in Progress',
            message: 'This feature is currently under development',
            buttons: ['OK']
          });
        
          await alert.present();
      } else {
          console.log('Feedback submission canceled by user.');
      }
  } else {
      console.warn('No feedback details to submit.');
      await this.presentAlert('Please add at least one product detail before submitting.'); // Notify user to add details
  }
}



async presentConfirm(header: string, message: string): Promise<boolean> {
    const alert = await this.alertController.create({
        header: header,
        message: message,
        buttons: [
            {
                text: 'Cancel',
                role: 'cancel',
                cssClass: 'secondary',
                handler: () => {
                    console.log('User canceled submission');
                    return false; // User canceled
                }
            },
            {
                text: 'OK',
                handler: () => {
                    console.log('User confirmed submission');
                    return true; // User confirmed
                }
            }
        ]
    });

    await alert.present();

    const { role } = await alert.onDidDismiss(); // Wait for the alert to be dismissed

    return role !== 'cancel'; // Return true if confirmed, false if canceled
}

async presentAlert(message: string) {
    const alert = await this.alertController.create({
        header: 'Notification',
        message: message,
        buttons: ['OK']
    });

    await alert.present();
}


  // Method to transform details into the desired format
private transformDetails(details: any[]): any[] {
  return details.map(detail => ({
      product_id: detail.product_id, // Store product ID, not name
      available: detail.available === "1" ? 1 : 0, // Convert string "1"/"0" to integer 1/0
      open_display: detail.open_display === "1" ? 1 : 0, // Convert string "1"/"0" to integer 1/0
      stock: parseInt(detail.stock, 10) || 0, // Ensure stock is an integer, defaulting to 0 if invalid
      attachment1_model_id: detail.attachment1_model_id || null,
      attachment2_model_id: detail.attachment2_model_id || null,
      attachment3_model_id: detail.attachment3_model_id || null,
  }));
}

// Convert '1' or '0' to boolean
isAvailable(value: string): boolean {
  return value === '1';
}

// Update the 'available' value when the toggle is changed
updateAvailable(detail: any, checked: boolean) {
  detail.available = checked ? '1' : '0';
}

// Update the 'open_display' value when the toggle is changed
// updateOpenDisplay(detail: any, checked: boolean) {
//   detail.open_display = checked ? '1' : '0';
// }

updateOpenDisplay(detail: any, checked: boolean): void {
  // Update the local state
  detail.open_display = checked ? '1' : '0';

  // // Prepare the payload for the API
  // const payload = {
  //   product_id: detail.id,
  //   open_display: detail.open_display,
  //   feedback_id:this.feedback_id
  // };

  
//-------------------frontend feedback--------------------------------
if (this.feedbackData && this.feedbackData.details.length > 0) {
  // Construct the payload for submission
  const userIdString = localStorage.getItem('userId');
  if (userIdString) this.userid = userIdString;
const payload = {
  user_id: this.userid,
  store_id: String(this.outletid),
  category_id: String(this.catid),
  feedback_date: new Date().toISOString(), // if required we will capture this in backedn api acc to server timmming
  feedback_text: this.feedback,
  details: this.transformDetails(this.feedbackData.details) // Transform details
};

this.calculateProgressPercentage(this.feedbackData.details);

console.log("on toggle update",payload);

}
}


}