import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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

  constructor(private apiService: ApiService, private route: ActivatedRoute,private alertController: AlertController,private authservice:AuthService,private router: Router) { }

selectedAttachment:any;
  selectOption(option: any,extraParam: string) {
    this.selectedAttachment = option;
    console.log('Selected Attachment ID:', this.selectedAttachment?.id);
    console.log('Extra Parameter:', extraParam);

}

ngOnInit() {
  // this.subscribeToQueryParams();
  this.getUserRole();
  // this.fetchColumnVisibility();
}



roleId: string | null = null;
lang: string | null = null;
cid: string | null = null;


getUserRole() {
  const UserId = localStorage.getItem('userId');
  if (UserId) {
    this.authservice.getUserRole(UserId).subscribe({
      next: (response) => {
        if (response.status) {
          this.roleId = response.data.role_id; 
          this.cid = response.data.region_id;
          // Check if cid is not defined
          if (!this.cid) {
            this.displayLocationAlert('User location is not defined.');
            return; // Exit the function if location is not defined
          }

          // When roleId and cid are available, call methods
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

// Custom function to show alert
async displayLocationAlert(message: string) {
  const alert = await this.alertController.create({
    header: 'Notification',
    message: message,
    buttons: [
      {
        text: 'OK',
        handler: () => {
          // Navigate to the home page when "OK" is clicked
          this.router.navigate(['/planogram-ranging-feedback']);
        }
      }
    ]
  });

  await alert.present();
}

userRole:any;

private subscribeToQueryParams(): void {
  this.route.queryParams.subscribe(params => {
    const catid = Number(params['categoryId']);
    const outletid = Number(params['outletId']);

    // const catid = Number(undefined);
    // const outletid = Number(undefined);
    
    let alertMessage = '';

    // Check if outletid is invalid first
    if (isNaN(outletid)) {
      alertMessage = 'Store is not listed.';
    }

    // Check if catid is invalid
    if (isNaN(catid)) {
      alertMessage += alertMessage ? ' and Category is not listed.' : 'Category is not listed.';
    }

    // If there's an alert message, display it
    if (alertMessage) {
      this.storeCategoryNotListedAlert(alertMessage);
      return; // Exit the function if any value is invalid
    }

    this.catid = catid;
    this.outletid = outletid;
    this.userRole = Number(this.roleId);

    this.fetchColumnVisibility(this.userRole, this.catid);
    this.initializePage(catid, outletid);
  });
}

// Custom function to show alert
async storeCategoryNotListedAlert(message: string) {
  const alert = await this.alertController.create({
    header: 'Alert',
    message: message,
    buttons: [
      {
        text: 'OK',
        handler: () => {
          // Navigate to the home page when "OK" is clicked
          this.router.navigate(['/planogram-ranging-feedback']);
        }
      }
    ]
  });

  await alert.present();
}







// Initialize page-related functionality
private initializePage(catid: number, outletid: number): void {
  if (!isNaN(catid)) {
    this.fetchProductsByCategory(catid);
    // this.fetchProductsByOutletAndCategory(outletid,catid);

    this.fetchCategoryName(catid);
  }

  this.fetchFeedbackData(outletid,catid);

  this.fetchAllProducts();
}

// Fetch feedback data
feedback_id:any;


storeproducts:any;


displayedData: any[] = [];

private fetchFeedbackData(outletId: number, categoryId: number) {
  // Fetch feedback first
  this.apiService.getLatestFeedback(categoryId, outletId).subscribe({
    next: (response) => {
      if (response.status && response.data.details && Array.isArray(response.data.details) && response.data.details.length > 0) {
        this.feedbackData = response.data;
        this.displayedData = this.feedbackData.details; // Use feedback if available
      } else {
        this.initializeFeedbackData(); // Fallback to default feedback structure
        this.fetchProducts(outletId, categoryId); // Fallback to products
      }
      console.log("Fetched Feedback Data:", this.feedbackData);
      this.calculateProgressPercentage(this.displayedData);
    },
    error: (err) => {
      console.error("Error fetching feedback:", err);
      this.initializeFeedbackData();
      this.fetchProducts(outletId, categoryId);
    }
  });
}

private fetchProducts(outletId: number, categoryId: number) {
  console.log("outletID",outletId);
  console.log("categoryId",categoryId);

  this.apiService.getProductsByOutletAndCategory(outletId, categoryId).subscribe({
    next: (response) => {
      if (response.status) {
        this.storeproducts = response.data;
        this.displayedData = this.storeproducts.map((product: { id: any; name: any; }) => ({
          product_id: product.id,
          product_name: product.name,
          available: false, // Default values if feedback doesn't exist
          open_display: false,
          stock: 0,
          feedback: '',
          attachment1_model_id: null,
          attachment2_model_id: null,
          attachment3_model_id: null
        }));

      

        this.feedbackData = {
          id: '',
          user_id: this.userid,
          store_id: String(this.outletid || ''),
          category_id: String(this.catid || ''),
          feedback: '',
          feedback_date: '',
          created_on: '',
          store_name: '',
          retailer_name: '',
          details: [] // Initialize the details array
        };

        console.log("Fetched Products:", this.displayedData);
        this.calculateProgressPercentage(this.displayedData);
      } else {
        this.storeproducts = [];
        this.displayedData = [];
        this.initializeFeedbackData(); // Ensure feedbackData is set properly
      }
    },
    error: (error) => {
      console.error("Error fetching products:", error);
      this.storeproducts = [];
      this.displayedData = [];
      this.initializeFeedbackData();
    }
  });
}

private initializeFeedbackData() {


  this.feedbackData = {
    id: '',
    user_id: this.userid,
    store_id: String(this.outletid || ''),
    category_id: String(this.catid || ''),
    feedback: '',
    feedback_date: '',
    created_on: '',
    store_name: '',
    retailer_name: '',
    details: [] // Initialize the details array
  };
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

  

  async notRangedAlert() {
    const alert = await this.alertController.create({
      header: 'Notification',
      message: 'adding (more) Store products are not ranged',
      buttons: ['OK']
    });
    await alert.present();
  }
  
 

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

   scrollToTable() {
    const tableContainer = document.getElementById('tableContainer');
    if (tableContainer) {
      tableContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
  
  @ViewChild('scrollContainer', { static: false }) scrollContainer!: ElementRef;

  scrollTable(direction: 'left' | 'right') {
    const scrollAmount = 200; // Adjust scrolling distance
    if (this.scrollContainer) {
      this.scrollContainer.nativeElement.scrollLeft += direction === 'right' ? scrollAmount : -scrollAmount;
    }
  }
  

  addProduct() {
    // if (this.selectedProduct && this.feedbackData) {
      if (this.selectedProduct && this.displayedData) {

      // Ensure details array is initialized before checking for existing products
      if (!Array.isArray(this.displayedData)) {
        this.displayedData = []; // Initialize as an empty array
      }
  
      // Check if product already exists in feedbackData.details
      const productExists = this.displayedData.some(detail => detail.product_id === this.selectedProduct.id);
  
      if (productExists) {
        this.showProd_existAlert('Product already exists in feedback details!');
        return; // Exit the function if product already exists
      }
  
      // Create a new feedback detail object
      const newDetail: FeedbackDetail = {
        id: '',
        feedback_id: '',
        product_id: this.selectedProduct.id,
        available: '0',
        open_display: '0',
        stock: '0',
        is_ranging: '0',
        attachment1_model_id: null,
        attachment2_model_id: null,
        attachment3_model_id: null,
        product_name: this.selectedProduct.name,
        feedback: ''
      };
  
      // Ensure feedbackData is initialized
      if (!this.displayedData) {
        const userIdString = localStorage.getItem('userId');
        if (userIdString) {
          this.userid = userIdString;
        } else {
          console.error('User ID not found in local storage.');
          return; // Exit the function if user ID is missing
        }
  
        // Initialize feedbackData object
        this.feedbackData = {
          id: '',
          user_id: this.userid,
          store_id: String(this.outletid || ''),
          category_id: String(this.catid || ''),
          feedback: '',
          feedback_date: '',
          created_on: '',
          store_name: '',
          retailer_name: '',
          details: [] // Initialize the details array
        };
      }
  
      // Push the new product detail to feedbackData.details
      this.displayedData.push(newDetail);
  
      // Reset selectedProduct
      this.selectedProduct = null;
  
      console.log('Product added successfully:', newDetail);
    }
  }
  
  
  // Custom function to show alert
  async showProd_existAlert(message: string) {
    const alert = await this.alertController.create({
      header: 'Alert',
      message: message,
      buttons: ['OK']
    });
  
    await alert.present();
  }
  

  onProductSelected(productId: any) {
    // console.log('Selected Product ID:', productId);
    if(productId){
    this.selectedProduct = productId;
    }
  }



    confirm_message:boolean =false;

  async submitFeedback() {
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
          // details: this.transformDetails(this.feedbackData.details) // Transform details
          details: this.transformDetails(this.displayedData) // Transform details

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

fetchColumnVisibility(userRole: number, catId: number) {
  this.apiService.getColumnVisibilityData(userRole, catId).subscribe((response) => {
    if (response.status) {
      const data = response.data[0];
        this.columnVisibility.productId = data.product === "1";
        this.columnVisibility.availableBoxDisplay = data.available_box_display  === "1";
        this.columnVisibility.availableOpenDisplay = data.available_open_display === "1";
        this.columnVisibility.minStockLevel = data.min_stock_level === "1"; 
        this.columnVisibility.stock = data.stock === "1"; 
        this.columnVisibility.lastUpdate = true; 
        this.columnVisibility.attachment1 = data.attachment1_model === "1"; 
        this.columnVisibility.attachment2 = data.attachment2_model === "1"; 
        this.columnVisibility.attachment3 = data.attachment3_model === "1"; 
        this.columnVisibility.feedback = data.feedback === "1"; 

        console.log("colun visibility",this.columnVisibility);

    }
  });
}

async WIPsubmitFeedback() {

      if (this.feedbackData && Array.isArray(this.displayedData) && this.displayedData.length > 0) {

      // Construct the payload for submission
      const userIdString = localStorage.getItem('userId');
      if (userIdString) this.userid = userIdString;

      const payload = {
        user_id: this.userid,
        store_id: String(this.outletid),
        category_id: String(this.catid),
        feedback_date: new Date().toISOString(), // if required we will capture this in backedn api acc to server timmming
        feedback_text: this.feedback || "",
        // details: this.transformDetails(this.feedbackData.details) // Transform details
        details: this.transformDetails(this.displayedData) // Transform details

      };
      

      console.log("payload checking column wise", payload);

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
                      this.router.navigate(['/planogram-ranging']);//added for exit unsaved changes
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

          // const alert = await this.alertController.create({
          //   header: 'Work in Progress',
          //   message: 'This feature is currently under development',
          //   buttons: ['OK']
          // });
        
          // await alert.present();
      } else {
          console.log('Feedback submission canceled by user.');
      }
  } else {
      console.warn('No feedback details to submit.');
      await this.presentAlert('Please add at least one product detail before submitting.'); // Notify user to add details
  }
}



  private transformDetails(details: any[]): any[] {
    return details.map(detail => ({
      product_id: this.columnVisibility.productId ? detail.product_id : null,
      available: this.columnVisibility.availableBoxDisplay ? (detail.available === "1" ? 1 : 0) : null,
      open_display: this.columnVisibility.availableOpenDisplay ? (detail.open_display === "1" ? 1 : 0) : null,
      stock: this.columnVisibility.stock ? (parseInt(detail.stock, 10) || 0) : null,
      attachment1_model_id: this.columnVisibility.attachment1 ? detail.attachment1_model_id || null : null,
      attachment2_model_id: this.columnVisibility.attachment2 ? detail.attachment2_model_id || null : null,
      attachment3_model_id: this.columnVisibility.attachment3 ? detail.attachment3_model_id || null : null,
      feedback: this.columnVisibility.feedback ? detail.feedback || null : null,
    }));
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



// Convert '1' or '0' to boolean
isAvailable(value: string): boolean {
  return value === '1';
}

// Update the 'available' value when the toggle is changed
updateAvailable(detail: any, checked: boolean) {
  detail.available = checked ? '1' : '0';
}



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
// if (this.feedbackData && this.feedbackData.details.length > 0) {
  if (this.displayedData && this.displayedData.length > 0) {

  // Construct the payload for submission
  const userIdString = localStorage.getItem('userId');
  if (userIdString) this.userid = userIdString;
// const payload = {
//   user_id: this.userid,
//   store_id: String(this.outletid),
//   category_id: String(this.catid),
//   feedback_date: new Date().toISOString(), // if required we will capture this in backedn api acc to server timmming
//   feedback_text: this.feedback,
//   details: this.transformDetails(this.feedbackData.details) // Transform details
// };

this.calculateProgressPercentage(this.displayedData);

// console.log("on toggle update",payload);

}
//-------------------frontend feedback--------------------------------


  // Call the API to save the changes
  // this.apiService.setOpenDisplay(payload).subscribe(
  //   (response) => {
  //     console.log('Successfully updated:', response);
  //     this.subscribeToQueryParams();
  //     // Optionally, show a success message or perform additional actions

  //   },
  //   (error) => {
  //     console.error('Failed to update:', error);
  //     // Optionally, revert the change locally if the API call fails
  //     detail.open_display = checked ? '0' : '1';
  //   }
  // );
}


}