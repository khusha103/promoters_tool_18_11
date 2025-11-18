// import { Component, OnDestroy, OnInit } from '@angular/core';
// import { ActivatedRoute, Router } from '@angular/router';
// import { ActionSheetController, AlertController, NavController, Platform } from '@ionic/angular';
// import { ApiService } from 'src/app/services/api.service';
// import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
// import { PageTransferDataService } from 'src/app/services/page-transfer-data.service';


// @Component({
//   selector: 'app-planogram-area',
//   templateUrl: './planogram-area.page.html',
//   styleUrls: ['./planogram-area.page.scss'],
// })
// export class PlanogramAreaPage implements OnInit,OnDestroy  {
//   planogramAreas: any[] = [];
//   feedbackList: any[] = [];
//   products: any[] = [];

//   areaId: number = 0;
//   categoryId: number = 0;
//   storeId: number = 0;
//   get_feedback_id: string = "";

//   userId: string | undefined;
//   feedbackdate: string | undefined;
//   // photos: { url: string;}[] = []; 
//   photos: { url: string, name: string, base64: string }[][] = [];
  
//   private backButtonSubscription: any;

//   finalfeedback: string = "";

//   receivedText:any;
//   constructor( private platform: Platform,
//     private navCtrl: NavController,private dataService:PageTransferDataService,private router: Router, private apiService: ApiService, private activatedRoute: ActivatedRoute, private actionSheetController: ActionSheetController, private alertController: AlertController) { 
    
//   }

//   handleBackNavigation() {
//     // If there's a condition before navigating back, show confirmation
//     // if (this.shouldConfirmBack()) {
//       this.showExitConfirmation();
//       // this.BacktoFeedbackPage();
//     //   console.log("yes kr diya");
//     // } else {
//     //   this.navCtrl.back(); // Navigate back
//     // }
//   }

//   shouldConfirmBack(): boolean {
//     // Check if feedback exists, or any condition where you want to show confirmation
//     return this.feedbackList.length > 0;
//   }

//   async showExitConfirmation() {
//     const alert = await this.alertController.create({
//       header: 'info',
//       message: 'Please use header back button',
//       buttons: [
//         {
//           text: 'ok',
//           role: 'cancel',
//         }
//         // ,
//         // {
//         //   text: 'Yes',
//         //   handler: () => {
//         //     this.navCtrl.back();
           
//         //   },
//         // },
//       ],
//     });

//     await alert.present();
//   }

//   ngOnDestroy() {
//     // Remove back button subscription when leaving the page
//     if (this.backButtonSubscription) {
//       this.backButtonSubscription.unsubscribe();
//     }
//   }

//   ngOnInit() {
//     // Handle back button press
//     this.backButtonSubscription = this.platform.backButton.subscribeWithPriority(10, () => {
//       this.handleBackNavigation();
//     });
//     console.log(this.feedbackList.length > 0);

//     // this.dataService.currentTextData.subscribe(data => {
//     //   this.receivedText = data;
//     //   this.finalfeedback = data;
//     //   console.log(this.receivedText);
//     // });
//     // this.userId = localStorage.getItem('userId') || 'Unknown';
//     // this.feedbackdate = new Date().toISOString().split('T')[0];


//     // this.activatedRoute.queryParams.subscribe(params => {
//     //   this.areaId = Number(params['areaId'] || 0);
//     //   this.categoryId = Number(params['categoryId'] || 0);
//     //   this.storeId = Number(params['storeId'] || 0);
//     //   this.finalfeedback = params['f'] || "";
//     //   this.get_feedback_id = params['fid'] || "";
//     //   if (this.areaId && this.categoryId && this.storeId) {
//     //     this.fetchPlanogramAreas();
//     //     this.fetchProductsByCategory(this.categoryId);
//     //   } else {
//     //     console.error("Missing required URL parameters!");
//     //   }
//     // });

//     // if (this.get_feedback_id !== "") {
//     //   this.fetchFeedbackData(+this.get_feedback_id, this.areaId);
//     // }
//     // // this.fetchFeedbackData(1, 1, 1);
//   }


//   ionViewWillEnter() {

//     this.isOnPlanogramSlidesFeedbackPage();

//     this.dataService.currentTextData.subscribe(data => {
//       this.receivedText = data;
//       this.finalfeedback = data;
//       console.log(this.receivedText);
//     });
//     this.userId = localStorage.getItem('userId') || 'Unknown';
//     this.feedbackdate = new Date().toISOString().split('T')[0];


//     this.activatedRoute.queryParams.subscribe(params => {
//       this.areaId = Number(params['areaId'] || 0);
//       this.categoryId = Number(params['categoryId'] || 0);
//       this.storeId = Number(params['storeId'] || 0);
//       // this.finalfeedback = params['f'] || "";
//       this.get_feedback_id = params['fid'] || "";
//       if (this.areaId && this.categoryId && this.storeId) {
//         this.fetchPlanogramAreas();
//         this.fetchProductsByCategory(this.categoryId);
//       } else {
//         console.error("Missing required URL parameters!");
//       }
//     });

//     if (this.get_feedback_id !== "") {
//       this.fetchFeedbackData(+this.get_feedback_id, this.areaId);
//     }
//     // this.fetchFeedbackData(1, 1, 1);
   
//   }

//   async BacktoFeedbackPage(){
//      // Show the success alert with options
//      const successAlert = await this.alertController.create({
//       header: 'Info',
//       message: 'Do you want to continue feedback for other slides or return to the main Planogram Area page?',
//       buttons: [
//         {
//           text: 'Continue Feedback',
//           role: 'cancel'
//         },
//         {
//           text: 'Back to Main Planogram Area',
//           handler: () => {
//             // this.router.navigate(['/planogram-feedback-form']); // Navigate to home page
//             // Navigate to planogram-area with query params
//             this.router.navigate(['/planogram-feedback-form'], {
//               queryParams: { categoryId: this.categoryId, storeId: this.storeId, fid: this.get_feedback_id }
//             });
//           }
//         }
//       ]
//     });

//     await successAlert.present();
//   }

//   onProductSelected(selectedProduct: any, planogramIndex: number, feedbackIndex: number) {
//     // console.log("Selected Product:", selectedProduct.id);//in payload capture ids

//     // Ensure the correct feedback item is updated
//     if (this.feedbackList[planogramIndex] && this.feedbackList[planogramIndex].feedbackItems[feedbackIndex]) {
//       this.feedbackList[planogramIndex].feedbackItems[feedbackIndex].product = selectedProduct;
//     }

//     console.log(this.feedbackList);
//   }




//   fetchPlanogramAreas() {
//     this.apiService.getPlanogramAreaImages(this.categoryId, this.areaId).subscribe((response) => {
//       if (response.status) {
//         this.planogramAreas = response.data;
//         console.log("Planogram Areas", this.planogramAreas);
//         // console.log(this.planogramAreas['3']['id']);
//         this.feedbackList = this.planogramAreas.map(() => ({
//           feedbackItems: this.getDefaultFeedbackItems(),
//         }));
//       }
//     });
//   }

//   fetchProductsByCategory(categoryId: number) {
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
//   }


//   getDefaultFeedbackItems() {
//     return Array(5).fill(null).map(() => ({ product: null, feedback: '' }));
//   }

//   addFeedback(index: number) {
//     this.feedbackList[index].feedbackItems.push({ product: '', feedback: '' });
//   }





//   async submitFeedback(planogramIndex: number) {
//     if (!this.feedbackList[planogramIndex]) {
//       await this.showAlert("No feedback found for this slide.");
//       return;
//     }

//     if (!this.userId || !this.feedbackdate || !this.areaId || !this.categoryId || !this.storeId) {
//       await this.showAlert("Missing required details. Please check user ID, feedback date, area, category, and store.");
//       return;
//     }

//     const feedbackDetails = this.feedbackList[planogramIndex].feedbackItems.map((feedback: { product: { id: any; }; feedback: any; }, index: number) => ({
//       pno: index + 1,
//       pid: feedback.product?.id,
//       f: feedback.feedback ?? ""
//     }));

//     if (feedbackDetails.length === 0) {
//       await this.showAlert("At least one feedback entry is required.");
//       return;
//     }

//     if (feedbackDetails.some((item: { pid: any; }) => !item.pid)) {
//       await this.showAlert("All feedback items must have a product selected.");
//       return;
//     }

//     if (!this.photos[planogramIndex] || this.photos[planogramIndex].length === 0) {
//       await this.showAlert("Please upload an image before submitting feedback.");
//       return;
//     }

//     const confirmAlert = await this.alertController.create({
//       header: 'Confirm Submission',
//       message: 'Are you sure you want to submit the Area Slide feedback?',
//       buttons: [
//         {
//           text: 'Cancel',
//           role: 'cancel'
//         },
//         {
//           text: 'Submit',
//           handler: async () => {
//             const submissionData = {
//               image: this.photos[planogramIndex] || [],
//               userId: this.userId,
//               feedbackDate: this.feedbackdate,
//               areaId: this.areaId,
//               categoryId: this.categoryId,
//               storeId: this.storeId,
//               finalFeedback: this.finalfeedback,
//               slideNumber: this.planogramAreas[planogramIndex]['id'],
//               feedback_id: this.get_feedback_id,
//               feedbackDetails
//             };

//             console.log("Final Submitted Feedback:", submissionData);

//             try {
//               const response = await this.apiService.postAreaSlideData(submissionData).toPromise();
//               console.log("API Response:", response);

//               if (response && response.success) {
//                 // Hide the submit button for this slide
//                 this.feedbackList[planogramIndex].submitted = true;
//                 this.get_feedback_id = response.feedback_id;

//                 const feedbackID = +this.get_feedback_id;

//                 // Fetch the feedback data after submission
//                 this.fetchFeedbackData(feedbackID, this.areaId);

//                 // Show the success alert with options
//                 const successAlert = await this.alertController.create({
//                   header: 'Slide Submitted',
//                   message: 'Feedback submitted successfully. Do you want to continue feedback for other slides or skip all slides?',
//                   buttons: [
//                     {
//                       text: 'Continue',
//                       role: 'cancel'
//                     },
//                     {
//                       text: 'Skip All Slides',
//                       handler: () => {
//                         this.router.navigate(['/planogram-feedback-form']); // Navigate to home page
//                         // Navigate to planogram-area with query params
//                         this.router.navigate(['/planogram-feedback-form'], {
//                           queryParams: { categoryId: this.categoryId, storeId: this.storeId, fid: this.get_feedback_id }
//                         });
//                       }
//                     }
//                   ]
//                 });

//                 await successAlert.present();
//               } else {
//                 await this.showAlert("Submission failed. Please try again.");
//               }
//             } catch (error) {
//               console.error("API Error:", error);
//               await this.showAlert("Error submitting feedback. Please check your internet connection and try again.");
//             }
//           }
//         }
//       ]
//     });

//     await confirmAlert.present();
//   }


//   slidefeedbackData: any;

//   private isOnPlanogramSlidesFeedbackPage(): boolean {
//     const currentUrl = this.router.url; 
//     const targetPath = '/planogram-area'; 
//     console.log("current url",currentUrl.startsWith(targetPath)); 
//     return currentUrl.startsWith(targetPath); 
//   }

//   async fetchFeedbackData(feedbackId: number, areaId: number) {
//     try {
//       // Call get_slideFeedback method from apiService to fetch the data
//       const response: any = await this.apiService.get_slideFeedback(feedbackId, areaId).toPromise();

//       if (response && !response.error) {
//         this.slidefeedbackData = response.data;  // Store the data in the component
//         console.log("slide feedback", this.slidefeedbackData);
       
//       } else {
//         await this.showAlert("No data found or error occurred while fetching feedback data.");
//       }
//     } catch (error) {
//       console.error("API Error:", error);
//       await this.showAlert("Error fetching feedback data.");
//     }
//   }



//   // Helper function to show alerts
//   async showsubmitAlert(message: string) {
//     const alert = await this.alertController.create({
//       header: 'Alert',
//       message,
//       buttons: ['OK']
//     });
//     await alert.present();
//   }






//   // Function to show alert messages using AlertController
//   async showAlert(message: string) {
//     const alert = await this.alertController.create({
//       header: 'Error',
//       message: message,
//       buttons: ['OK']
//     });

//     await alert.present();
//   }

//   deleteLastFeedback(planogramIndex: number) {
//     // Remove the last feedback item for the specific planogram
//     const feedbackItems = this.feedbackList[planogramIndex]?.feedbackItems;

//     if (feedbackItems && feedbackItems.length > 0) {
//       feedbackItems.pop(); // Removes the last feedback item
//       console.log("Last feedback entry deleted:", feedbackItems);
//     } else {
//       console.log("No feedback entries to delete.");
//     }
//   }

//   async selectImage(planogramIndex: number) {
//     const actionSheet = await this.actionSheetController.create({
//       header: 'Select Image Source',
//       buttons: [
//         {
//           text: 'Camera',
//           handler: () => {
//             this.captureImage(CameraSource.Camera, planogramIndex);
//           }
//         },
//         {
//           text: 'Gallery',
//           handler: () => {
//             this.captureImage(CameraSource.Photos, planogramIndex);
//           }
//         },
//         {
//           text: 'Cancel',
//           role: 'cancel'
//         }
//       ]
//     });
//     await actionSheet.present();
//   }


//   // async captureImage(source: CameraSource, planogramIndex: number) {
//   //   try {
//   //     const image = await Camera.getPhoto({
//   //       quality: 90,
//   //       allowEditing: false,
//   //       resultType: CameraResultType.Base64, // Change result type to Base64
//   //       source: source
//   //     });

//   //     console.log("Captured Image Data:", image);


//   //     this.photos[planogramIndex] = []; // Allow only one image per question

//   //     if (!this.photos[planogramIndex]) {
//   //       this.photos[planogramIndex] = [];
//   //     }

//   //     if (image && image.base64String) {


//   //       const imageFormat = image.format || 'jpeg'; // Default to 'jpeg' if not provided

//   //       const fileName = `img.${imageFormat}`;
//   //       const uniqueFileName = `img_${Date.now()}.${imageFormat}`; // Unique file name

//   //       this.photos[planogramIndex].push({
//   //         url: uniqueFileName,
//   //         name: fileName,
//   //         base64: `data:image/jpeg;base64,${image.base64String}`
//   //       });
//   //     }

//   //     console.log(this.photos);
//   //   } catch (error) {
//   //     console.error('Error capturing image:', error);
//   //   }
//   // }


//   async captureImage(source: CameraSource, planogramIndex: number) {
//     try {
//       const image = await Camera.getPhoto({
//         quality: 50, // Reduce quality to compress size
//         allowEditing: false,
//         resultType: CameraResultType.Base64,
//         source: source
//       });
  
//       console.log("Captured Image Data:", image);
  
//       this.photos[planogramIndex] = []; // Allow only one image per question
  
//       if (image && image.base64String) {
//         const compressedBase64 = await this.compressImage(image.base64String, 0.5); // Compress further
  
//         const imageFormat = image.format || 'jpeg'; // Default to 'jpeg' if not provided
//         const fileName = `img_${Date.now()}.${imageFormat}`;
//         const uniqueFileName = `img_${Date.now()}.${imageFormat}`; // Unique file name
  
//         this.photos[planogramIndex].push({
//           url: uniqueFileName,
//           name: fileName,
//           base64: compressedBase64 // Store compressed Base64
//         });
//       }
  
//       console.log(this.photos);
//     } catch (error) {
//       console.error('Error capturing image:', error);
//     }
//   }

//   compressImage(base64Str: string, quality: number): Promise<string> {
//     return new Promise((resolve) => {
//       const img = new Image();
//       img.src = `data:image/jpeg;base64,${base64Str}`;
//       img.onload = () => {
//         const canvas = document.createElement('canvas');
//         const ctx = canvas.getContext('2d');
  
//         // Resize the image to 50% of its original size
//         canvas.width = img.width * 0.5;
//         canvas.height = img.height * 0.5;
  
//         ctx!.drawImage(img, 0, 0, canvas.width, canvas.height);
  
//         // Convert canvas to compressed Base64
//         const compressedBase64 = canvas.toDataURL('image/jpeg', quality);
//         resolve(compressedBase64);
//       };
//     });
//   }
  

// }

import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ActionSheetController, AlertController, NavController, Platform } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { PageTransferDataService } from 'src/app/services/page-transfer-data.service';


@Component({
  selector: 'app-planogram-area',
  templateUrl: './planogram-area.page.html',
  styleUrls: ['./planogram-area.page.scss'],
})
export class PlanogramAreaPage implements OnInit,OnDestroy  {
  planogramAreas: any[] = [];
  feedbackList: any[] = [];
  products: any[] = [];

  areaId: number = 0;
  categoryId: number = 0;
  storeId: number = 0;
  get_feedback_id: string = "";

  userId: string | undefined;
  feedbackdate: string | undefined;
  // photos: { url: string;}[] = []; 
  photos: { url: string, name: string, base64: string }[][] = [];
  
  private backButtonSubscription: any;

  finalfeedback: string = "";

  receivedText:any;
  constructor( private platform: Platform,
    private navCtrl: NavController,private dataService:PageTransferDataService,private router: Router, private apiService: ApiService, private activatedRoute: ActivatedRoute, private actionSheetController: ActionSheetController, private alertController: AlertController) { 
    
  }

  handleBackNavigation() {
    // If there's a condition before navigating back, show confirmation
    // if (this.shouldConfirmBack()) {
      this.showExitConfirmation();
      // this.BacktoFeedbackPage();
    //   console.log("yes kr diya");
    // } else {
    //   this.navCtrl.back(); // Navigate back
    // }
  }

  shouldConfirmBack(): boolean {
    // Check if feedback exists, or any condition where you want to show confirmation
    return this.feedbackList.length > 0;
  }

  async showExitConfirmation() {
    const alert = await this.alertController.create({
      header: 'info',
      message: 'Please use header back button',
      buttons: [
        {
          text: 'ok',
          role: 'cancel',
        }
        // ,
        // {
        //   text: 'Yes',
        //   handler: () => {
        //     this.navCtrl.back();
           
        //   },
        // },
      ],
    });

    await alert.present();
  }

  ngOnDestroy() {
    // Remove back button subscription when leaving the page
    if (this.backButtonSubscription) {
      this.backButtonSubscription.unsubscribe();
    }
  }

  ngOnInit() {
    // Handle back button press
    this.backButtonSubscription = this.platform.backButton.subscribeWithPriority(10, () => {
      this.handleBackNavigation();
    });
    console.log(this.feedbackList.length > 0);

    // this.dataService.currentTextData.subscribe(data => {
    //   this.receivedText = data;
    //   this.finalfeedback = data;
    //   console.log(this.receivedText);
    // });
    // this.userId = localStorage.getItem('userId') || 'Unknown';
    // this.feedbackdate = new Date().toISOString().split('T')[0];


    // this.activatedRoute.queryParams.subscribe(params => {
    //   this.areaId = Number(params['areaId'] || 0);
    //   this.categoryId = Number(params['categoryId'] || 0);
    //   this.storeId = Number(params['storeId'] || 0);
    //   this.finalfeedback = params['f'] || "";
    //   this.get_feedback_id = params['fid'] || "";
    //   if (this.areaId && this.categoryId && this.storeId) {
    //     this.fetchPlanogramAreas();
    //     this.fetchProductsByCategory(this.categoryId);
    //   } else {
    //     console.error("Missing required URL parameters!");
    //   }
    // });

    // if (this.get_feedback_id !== "") {
    //   this.fetchFeedbackData(+this.get_feedback_id, this.areaId);
    // }
    // // this.fetchFeedbackData(1, 1, 1);
  }


  ionViewWillEnter() {

    this.isOnPlanogramSlidesFeedbackPage();

    this.dataService.currentTextData.subscribe(data => {
      this.receivedText = data;
      this.finalfeedback = data;
      console.log(this.receivedText);
    });
    this.userId = localStorage.getItem('userId') || 'Unknown';
    this.feedbackdate = new Date().toISOString().split('T')[0];


    this.activatedRoute.queryParams.subscribe(params => {
      this.areaId = Number(params['areaId'] || 0);
      this.categoryId = Number(params['categoryId'] || 0);
      this.storeId = Number(params['storeId'] || 0);
      // this.finalfeedback = params['f'] || "";
      this.get_feedback_id = params['fid'] || "";
      if (this.areaId && this.categoryId && this.storeId) {
        this.fetchPlanogramAreas();
        this.fetchProductsByCategory(this.categoryId);
      } else {
        console.error("Missing required URL parameters!");
      }
    });

    if (this.get_feedback_id !== "") {
      this.fetchFeedbackData(+this.get_feedback_id, this.areaId);
    }
    // this.fetchFeedbackData(1, 1, 1);
   
  }

  async BacktoFeedbackPage(){
     // Show the success alert with options
     const successAlert = await this.alertController.create({
      header: 'Info',
      message: 'Do you want to continue feedback for other slides or return to the main Planogram Area page?',
      buttons: [
        {
          text: 'Continue Feedback',
          role: 'cancel'
        },
        {
          text: 'Back to Main Planogram Area',
          handler: () => {
            // this.router.navigate(['/planogram-feedback-form']); // Navigate to home page
            // Navigate to planogram-area with query params
            this.router.navigate(['/planogram-feedback-form'], {
              queryParams: { categoryId: this.categoryId, storeId: this.storeId, fid: this.get_feedback_id }
            });
          }
        }
      ]
    });

    await successAlert.present();
  }

  onProductSelected(selectedProduct: any, planogramIndex: number, feedbackIndex: number) {
    // console.log("Selected Product:", selectedProduct.id);//in payload capture ids

    // Ensure the correct feedback item is updated
    if (this.feedbackList[planogramIndex] && this.feedbackList[planogramIndex].feedbackItems[feedbackIndex]) {
      this.feedbackList[planogramIndex].feedbackItems[feedbackIndex].product = selectedProduct;
    }

    console.log(this.feedbackList);
  }




  fetchPlanogramAreas() {
    this.apiService.getPlanogramAreaImages(this.categoryId, this.areaId).subscribe((response) => {
      if (response.status) {
        this.planogramAreas = response.data;
        console.log("Planogram Areas", this.planogramAreas);
        // console.log(this.planogramAreas['3']['id']);
        this.feedbackList = this.planogramAreas.map(() => ({
          feedbackItems: this.getDefaultFeedbackItems(),
        }));
      }
    });
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


  getDefaultFeedbackItems() {
    return Array(21).fill(null).map(() => ({ product: null, feedback: '' }));
  }

  addFeedback(index: number) {
    this.feedbackList[index].feedbackItems.push({ product: '', feedback: '' });
  }





  // async submitFeedback(planogramIndex: number) {
  //   if (!this.feedbackList[planogramIndex]) {
  //     await this.showAlert("No feedback found for this slide.");
  //     return;
  //   }

  //   if (!this.userId || !this.feedbackdate || !this.areaId || !this.categoryId || !this.storeId) {
  //     await this.showAlert("Missing required details. Please check user ID, feedback date, area, category, and store.");
  //     return;
  //   }

  //   const feedbackDetails = this.feedbackList[planogramIndex].feedbackItems.map((feedback: { product: { id: any; }; feedback: any; }, index: number) => ({
  //     pno: index + 1,
  //     pid: feedback.product?.id,
  //     f: feedback.feedback ?? ""
  //   })).filter((item: { pid: undefined; }) => item.pid !== undefined); // Remove items where pid is undefined;

  //   if (feedbackDetails.length === 0) {
  //     await this.showAlert("At least one feedback entry is required.");
  //     return;
  //   }

  //   // if (feedbackDetails.some((item: { pid: any; }) => !item.pid)) {
  //   //   await this.showAlert("All feedback items must have a product selected.");
  //   //   return;
  //   // }

  //   if (!this.photos[planogramIndex] || this.photos[planogramIndex].length === 0) {
  //     // await this.showAlert("Please upload an image before submitting feedback.");
  //     await this.showAlert("Don’t forget to upload images for reference.");
  //     // return;
  //   }

  //   const confirmAlert = await this.alertController.create({
  //     header: 'Confirm Submission',
  //     message: 'Are you sure you want to submit the Area Slide feedback?',
  //     buttons: [
  //       {
  //         text: 'Cancel',
  //         role: 'cancel'
  //       },
  //       {
  //         text: 'Submit',
  //         handler: async () => {
  //           const submissionData = {
  //             image: this.photos[planogramIndex] || [],
  //             userId: this.userId,
  //             feedbackDate: this.feedbackdate,
  //             areaId: this.areaId,
  //             categoryId: this.categoryId,
  //             storeId: this.storeId,
  //             finalFeedback: this.finalfeedback,
  //             slideNumber: this.planogramAreas[planogramIndex]['id'],
  //             feedback_id: this.get_feedback_id,
  //             feedbackDetails
  //           };

  //           console.log("Final Submitted Feedback:", submissionData);

  //           // return;

  //           try {
  //             const response = await this.apiService.postAreaSlideData(submissionData).toPromise();
  //             console.log("API Response:", response);

  //             if (response && response.success) {
  //               // Hide the submit button for this slide
  //               this.feedbackList[planogramIndex].submitted = true;
  //               this.get_feedback_id = response.feedback_id;

  //               const feedbackID = +this.get_feedback_id;

  //               // Fetch the feedback data after submission
  //               this.fetchFeedbackData(feedbackID, this.areaId);

  //               // Show the success alert with options
  //               const successAlert = await this.alertController.create({
  //                 header: 'Slide Submitted',
  //                 message: 'Feedback submitted successfully. Do you want to continue feedback for other slides or skip all slides?',
  //                 buttons: [
  //                   {
  //                     text: 'Continue',
  //                     role: 'cancel'
  //                   },
  //                   {
  //                     text: 'Skip All Slides',
  //                     handler: () => {
  //                       this.router.navigate(['/planogram-feedback-form']); // Navigate to home page
  //                       // Navigate to planogram-area with query params
  //                       this.router.navigate(['/planogram-feedback-form'], {
  //                         queryParams: { categoryId: this.categoryId, storeId: this.storeId, fid: this.get_feedback_id }
  //                       });
  //                     }
  //                   }
  //                 ]
  //               });

  //               await successAlert.present();
  //             } else {
  //               await this.showAlert("Submission failed. Please try again.");
  //             }
  //           } catch (error) {
  //             console.error("API Error:", error);
  //             await this.showAlert("Error submitting feedback. Please check your internet connection and try again.");
  //           }
  //         }
  //       }
  //     ]
  //   });

  //   await confirmAlert.present();
  // }

  async submitFeedback(planogramIndex: number) {
    if (!this.feedbackList[planogramIndex]) {
      await this.showAlert("No feedback found for this slide.");
      return;
    }

    if (!this.userId || !this.feedbackdate || !this.areaId || !this.categoryId || !this.storeId) {
      await this.showAlert("Missing required details. Please check user ID, feedback date, area, category, and store.");
      return;
    }

    const feedbackDetails = this.feedbackList[planogramIndex].feedbackItems.map((feedback: { product: { id: any; }; feedback: any; }, index: number) => ({
      pno: index + 1,
      pid: feedback.product?.id,
      f: feedback.feedback ?? ""
    })).filter((item: { pid: undefined; }) => item.pid !== undefined); // Remove items where pid is undefined;

    if (feedbackDetails.length === 0) {
      await this.showAlert("At least one feedback entry is required.");
      return;
    }

    if (!this.photos[planogramIndex] || this.photos[planogramIndex].length === 0) {
      const imageAlert = await this.alertController.create({
        header: 'Reminder',
        message: "Don’t forget to upload images for reference.",
        buttons: [
          {
            text: 'OK',
            handler: async () => {
              // Continue the process after showing the reminder
              await this.proceedWithSubmission(planogramIndex, feedbackDetails);
            }
          }
        ]
      });

      await imageAlert.present();
    } else {
      // Proceed if images are already uploaded
      await this.proceedWithSubmission(planogramIndex, feedbackDetails);
    }
}

async proceedWithSubmission(planogramIndex: number, feedbackDetails: any) {
    const confirmAlert = await this.alertController.create({
      header: 'Confirm Submission',
      message: 'Are you sure you want to submit the Area Slide feedback?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Submit',
          handler: async () => {
            const submissionData = {
              image: this.photos[planogramIndex] || [],
              userId: this.userId,
              feedbackDate: this.feedbackdate,
              areaId: this.areaId,
              categoryId: this.categoryId,
              storeId: this.storeId,
              finalFeedback: this.finalfeedback,
              slideNumber: this.planogramAreas[planogramIndex]['id'],
              feedback_id: this.get_feedback_id,
              feedbackDetails
            };

            console.log("Final Submitted Feedback:", submissionData);

            try {
              const response = await this.apiService.postAreaSlideData(submissionData).toPromise();
              console.log("API Response:", response);

              if (response && response.success) {
                this.feedbackList[planogramIndex].submitted = true;
                this.get_feedback_id = response.feedback_id;
                const feedbackID = +this.get_feedback_id;

                this.fetchFeedbackData(feedbackID, this.areaId);

                const successAlert = await this.alertController.create({
                  header: 'Slide Submitted',
                  message: 'Feedback submitted successfully. Do you want to continue feedback for other slides or skip all slides?',
                  buttons: [
                    {
                      text: 'Continue',
                      role: 'cancel'
                    },
                    {
                      text: 'Skip All Slides',
                      handler: () => {
                        this.router.navigate(['/planogram-feedback-form'], {
                          queryParams: { categoryId: this.categoryId, storeId: this.storeId, fid: this.get_feedback_id }
                        });
                      }
                    }
                  ]
                });

                await successAlert.present();
              } else {
                await this.showAlert("Submission failed. Please try again.");
              }
            } catch (error) {
              console.error("API Error:", error);
              await this.showAlert("Error submitting feedback. Please check your internet connection and try again.");
            }
          }
        }
      ]
    });

    await confirmAlert.present();
}



  slidefeedbackData: any;

  private isOnPlanogramSlidesFeedbackPage(): boolean {
    const currentUrl = this.router.url; 
    const targetPath = '/planogram-area'; 
    console.log("current url",currentUrl.startsWith(targetPath)); 
    return currentUrl.startsWith(targetPath); 
  }

  async fetchFeedbackData(feedbackId: number, areaId: number) {
    try {
      // Call get_slideFeedback method from apiService to fetch the data
      const response: any = await this.apiService.get_slideFeedback(feedbackId, areaId).toPromise();

      if (response && !response.error) {
        this.slidefeedbackData = response.data;  // Store the data in the component
        console.log("slide feedback", this.slidefeedbackData);
       
      } else {
        // await this.showAlert("No data found or error occurred while fetching feedback data.");
      }
    } catch (error) {
      console.error("API Error:", error);
      await this.showAlert("Error fetching feedback data.");
    }
  }



  // Helper function to show alerts
  async showsubmitAlert(message: string) {
    const alert = await this.alertController.create({
      header: 'Alert',
      message,
      buttons: ['OK']
    });
    await alert.present();
  }






  // Function to show alert messages using AlertController
  async showAlert(message: string) {
    const alert = await this.alertController.create({
      header: 'Reminder',
      message: message,
      buttons: ['OK']
    });

    await alert.present();
  }

  deleteLastFeedback(planogramIndex: number) {
    // Remove the last feedback item for the specific planogram
    const feedbackItems = this.feedbackList[planogramIndex]?.feedbackItems;

    if (feedbackItems && feedbackItems.length > 0) {
      feedbackItems.pop(); // Removes the last feedback item
      console.log("Last feedback entry deleted:", feedbackItems);
    } else {
      console.log("No feedback entries to delete.");
    }
  }

  async selectImage(planogramIndex: number) {
    const actionSheet = await this.actionSheetController.create({
      header: 'Select Image Source',
      buttons: [
        {
          text: 'Camera',
          handler: () => {
            this.captureImage(CameraSource.Camera, planogramIndex);
          }
        },
        {
          text: 'Gallery',
          handler: () => {
            this.captureImage(CameraSource.Photos, planogramIndex);
          }
        },
        {
          text: 'Cancel',
          role: 'cancel'
        }
      ]
    });
    await actionSheet.present();
  }


  // async captureImage(source: CameraSource, planogramIndex: number) {
  //   try {
  //     const image = await Camera.getPhoto({
  //       quality: 90,
  //       allowEditing: false,
  //       resultType: CameraResultType.Base64, // Change result type to Base64
  //       source: source
  //     });

  //     console.log("Captured Image Data:", image);


  //     this.photos[planogramIndex] = []; // Allow only one image per question

  //     if (!this.photos[planogramIndex]) {
  //       this.photos[planogramIndex] = [];
  //     }

  //     if (image && image.base64String) {


  //       const imageFormat = image.format || 'jpeg'; // Default to 'jpeg' if not provided

  //       const fileName = `img.${imageFormat}`;
  //       const uniqueFileName = `img_${Date.now()}.${imageFormat}`; // Unique file name

  //       this.photos[planogramIndex].push({
  //         url: uniqueFileName,
  //         name: fileName,
  //         base64: `data:image/jpeg;base64,${image.base64String}`
  //       });
  //     }

  //     console.log(this.photos);
  //   } catch (error) {
  //     console.error('Error capturing image:', error);
  //   }
  // }


  async captureImage(source: CameraSource, planogramIndex: number) {
    try {
      const image = await Camera.getPhoto({
        quality: 50, // Reduce quality to compress size
        allowEditing: false,
        resultType: CameraResultType.Base64,
        source: source
      });
  
      console.log("Captured Image Data:", image);
  
      this.photos[planogramIndex] = []; // Allow only one image per question
  
      if (image && image.base64String) {
        const compressedBase64 = await this.compressImage(image.base64String, 0.5); // Compress further
  
        const imageFormat = image.format || 'jpeg'; // Default to 'jpeg' if not provided
        const fileName = `img_${Date.now()}.${imageFormat}`;
        const uniqueFileName = `img_${Date.now()}.${imageFormat}`; // Unique file name
  
        this.photos[planogramIndex].push({
          url: uniqueFileName,
          name: fileName,
          base64: compressedBase64 // Store compressed Base64
        });
      }
  
      console.log(this.photos);
    } catch (error) {
      console.error('Error capturing image:', error);
    }
  }

  compressImage(base64Str: string, quality: number): Promise<string> {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = `data:image/jpeg;base64,${base64Str}`;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
  
        // Resize the image to 50% of its original size
        canvas.width = img.width * 0.5;
        canvas.height = img.height * 0.5;
  
        ctx!.drawImage(img, 0, 0, canvas.width, canvas.height);
  
        // Convert canvas to compressed Base64
        const compressedBase64 = canvas.toDataURL('image/jpeg', quality);
        resolve(compressedBase64);
      };
    });
  }
  

}

