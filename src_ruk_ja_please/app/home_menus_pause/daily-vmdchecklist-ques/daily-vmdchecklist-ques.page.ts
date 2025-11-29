import { Component, OnInit } from '@angular/core';
// import { ActivatedRoute } from '@angular/router';
import { ActivatedRoute, Router } from '@angular/router';
import { ActionSheetController, AlertController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';
import { environment } from 'src/environments/environment';
import { Browser } from '@capacitor/browser';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';



@Component({
  selector: 'app-daily-vmdchecklist-ques',
  templateUrl: './daily-vmdchecklist-ques.page.html',
  styleUrls: ['./daily-vmdchecklist-ques.page.scss'],
})
export class DailyVmdchecklistQuesPage implements OnInit {
  userData: any = {}; // Initialize userData
  questions: any[] = [];
  selectedStoreId!: number; // Store ID to be passed
  userId!: number; // User ID to be passed
  // categoryId!: number; // Category ID to be passed
  categoryId!: string;
  countryId!: string;
  storeId!: string;
  photos: { url:string,name:string,base64:string }[][] = [];


  baseUrl: string = `${environment.baseUrl}/happyproject/uploads/`;
  feedback: string = ''; 


  constructor(private apiService:ApiService,private route: ActivatedRoute,private alertController: AlertController,private router: Router,private actionSheetController: ActionSheetController) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.categoryId = params['categoryId'];
      this.countryId = params['countryId'];
      this.storeId = params['storeId'];

      // Log the values to the console
      console.log('Category ID:', this.categoryId);
      console.log('Country ID:', this.countryId);
      console.log('Store ID:', this.storeId);
    });
    this.loadSpecialQuestions();
  }


  loadSpecialQuestions() {
    const catId = +this.categoryId; 
    const countryId = +this.countryId;
    this.apiService.getSpecialQuestions(catId, countryId).subscribe((response) => {
      if (response.status) {
        console.log(response);
        this.questions = response.data.map((q: any) => ({
          ...q,
          selectedOption: null,
          remarks: ''
        }));
      }
    });
  }


 // Method to open a URL in the in-app browser with customization
 async openImageInBrowser(url: string) {
  try {
    await Browser.open({
      url: url,
      toolbarColor: '#000000', // Customize toolbar color (hex code)
      presentationStyle: 'fullscreen' // Optional: presentation style for iOS
    });
  } catch (error) {
    console.error('Error opening in-app browser:', error);
    // Optionally, display an alert or notification for error handling
  }
}

 async showExitConfirmationQues() {
  const message = 'You have unsaved changes in the questionnaire. Are you sure you want to back?';

  const alert = await this.alertController.create({
      header: 'Reminder !!',
      message: message,
      buttons: [
          {
              text: 'Stay',
              role: 'cancel',
              handler: () => {
                  console.log('Application exit prevented!');
              },
          },
          {
              text: 'Back',
              handler: () => {
                  // App.exitApp(); // Close app using Capacitor's App plugin
                  // this.location.back();
                  this.router.navigate(['/home']); // Redirect to home page
              },
          },
      ],
  });
  
  await alert.present();
}


// async present() {
//   const alert = await this.alertController.create({
//       header: 'Reminder !!',
//       message: 'You have unsaved changes in the questionnaire. Are you sure you want to back?',
//       buttons: [
//           {
//               text: 'OK',
//               handler: () => {
//                   this.router.navigate(['/home']); // Redirect to home page
//               }
//           }
//       ]
//   });

//   await alert.present();
// }

// async showExitConfirmationQues() {
//   const alert = await this.alertController.create({
//     header: 'Confirm Exit',
//     message: 'You have unsaved changes in the questionnaire. Are you sure you want to back?',
//     buttons: [
//       {
//         text: 'Stay',
//         role: 'cancel', // Just dismiss the alert
//       },
//       {
//         text: 'Back',
//         handler: () => {
//           this.router.navigate(['/home']); // Redirect to home page
//         },
//       },
//     ],
//   });

//   await alert.present();
// }
  evalId!:string;
  // submitAnswers() {
  //   const userIdString = localStorage.getItem('userId');
  //     const userId = userIdString ? Number(userIdString) : null;
  //     // console.log("photos",this.photos);
  //   const payload = {
      
  //     storeId: this.storeId,
  //     userId: userId,
  //     categoryId: this.categoryId,
  //     feedback:this.feedback,
  //     questions: this.questions.map((q, index) => ({
  //       id: q.id,
  //       sel_option: q.selectedOption,
  //       remark: q.remarks,
  //       image: this.photos[index] ? this.photos[index] : [] // Pass images for each question
  //     }))
  //   };

  //   // console.log("payload",payload);

  //   //  this.presentAlert();

  //   this.apiService.postChecklistAnswers(payload).subscribe(
  //     async (response) => {
  //       console.log('Submission successful:', response);
  //       // Handle success response here (e.g., show a success message)
  //       this.evalId = response.eval_id;
  //        // Show alert on successful submission
  //        await this.presentAlert();
  //     },
  //     (error) => {
  //       console.error('Error submitting answers:', error);
  //       // Handle error response here (e.g., show an error message)
  //     }
  //   );
  // }
  submitAnswers() {
    const userIdString = localStorage.getItem('userId');
    const userId = userIdString ? Number(userIdString) : null;
  
    const payload = {
      storeId: this.storeId,
      userId: userId,
      categoryId: this.categoryId,
      feedback: this.feedback, // optional main feedback if needed
      questions: this.questions.map((q, index) => ({
        id: q.id,
        sel_option: q.selectedOption,
        remark: q.remarks,
        image: this.photos[index] ? this.photos[index] : [] // Image array per question
      })),
      feedback_images: this.feedbackImages.map((item) => ({
        caption: item.caption,
        image: item.base64
      }))
    };
  
    console.log("payload", payload);
  
    this.apiService.postChecklistAnswers(payload).subscribe(
      async (response) => {
        console.log('Submission successful:', response);
        this.evalId = response.eval_id;
        await this.presentAlert();
      },
      (error) => {
        console.error('Error submitting answers:', error);
      }
    );
  }

  // removeFeedbackImage(index: number) {
  //   this.feedbackImages[index].base64 = '';
  //   this.feedbackImages[index].caption = ''; // optional: if you want to reset the caption too
  // }
  
  removeFeedbackSection(index: number) {
    this.feedbackImages.splice(index, 1);
  }
  
  


  async presentAlert() {
    const alert = await this.alertController.create({
        header: 'Success',
        message: 'Submit successfully',
        buttons: [
            {
                text: 'OK',
                handler: () => {
                    this.router.navigate(['/home']); // Redirect to home page
                }
            }
        ]
    });

    await alert.present();
}

// async presentAlert() {
//   const alert = await this.alertController.create({
//     header: 'Success',
//     message: 'Submit successfully. Do you want to submit feedback photo as well?',
//     buttons: [
//       {
//         text: 'Back',
//         handler: () => {
//           this.router.navigate(['/home']);
//         }
//       },
//       {
//         text: 'OK',
//         handler: () => {
//           this.feedphoto();
//         }
//       }
//     ]
//   });

//   await alert.present();
// }


  feedphoto() {
    // Your feedphoto function implementation
    console.log('Feed photo function called');
    this.router.navigate(['/daily-vmdchecklist-feedphoto'], {
      queryParams: {
        categoryId: this.categoryId,
        evalId: this.evalId,
        s: "v"//source:vmd
      }
    });
  }

  // Check if all questions have at least one radio button selected
  // areAllQuestionsAnswered(): boolean {
  //   // return this.questions.every(question => question.sel_option !== undefined);
  //   // return true;
  //   return this.questions.every(question => question.selectedOption !== null && question.selectedOption !== undefined);
  // }

  // areAllQuestionsAnswered(): boolean {
  //   const allQuestionsAnswered = this.questions.every(
  //     question => question.selectedOption !== null && question.selectedOption !== undefined
  //   );
  
  //   const allFeedbackValid = this.feedbackImages.length > 0 && this.feedbackImages.every(
  //     feedback => (feedback.caption && feedback.caption.trim() !== '') || feedback.base64
  //   );
  
  //   return allQuestionsAnswered && allFeedbackValid;
  // }

  areAllQuestionsAnswered(): boolean {
    const allQuestionsAnswered = this.questions.every(
      question => question.selectedOption !== null && question.selectedOption !== undefined
    );
 
    // const allFeedbackValid = this.feedbackImages.length > 0 && this.feedbackImages.every(
    //   feedback => (feedback.caption && feedback.caption.trim() !== '') || feedback.base64
    // );
 
    // return allQuestionsAnswered && allFeedbackValid;
    return allQuestionsAnswered ;
 
  }
  
  


  async selectImage(questionIndex: number) {
    const actionSheet = await this.actionSheetController.create({
      header: 'Select Image Source',
      buttons: [
        {
          text: 'Camera',
          handler: () => {
            this.captureImage(CameraSource.Camera, questionIndex);
          }
        },
        {
          text: 'Gallery',
          handler: () => {
            this.captureImage(CameraSource.Photos, questionIndex);
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

  // Function to capture image from Camera or Gallery
  // async captureImage(source: CameraSource, questionIndex: number) {
  //   try {
  //     const image = await Camera.getPhoto({
  //       quality: 90,
  //       allowEditing: false,
  //       resultType: CameraResultType.Uri,
  //       source: source
  //     });


  //     this.photos[questionIndex] = [];//only allow one image to upload that's why empty
  //     // Initialize the photos array for this slide if not already initialized
  //     if (!this.photos[questionIndex]) {
  //       this.photos[questionIndex] = [];
  //     }

  //     if (image && image.webPath) {
  //       const fileUri = image.webPath;
  //       this.photos[questionIndex].push({ url: fileUri });
  //     }

  //     console.log(this.photos);
  //   } catch (error) {
  //     console.error('Error capturing image:', error);
  //   }
  // }

  // async captureImage(source: CameraSource, questionIndex: number) {
  //   try {
  //     const image = await Camera.getPhoto({
  //       quality: 90,
  //       allowEditing: false,
  //       resultType: CameraResultType.Base64, // Change result type to Base64
  //       source: source
  //     });

  //     console.log("image data",image);
  
  //     this.photos[questionIndex] = []; // Allow only one image per question
  
  //     if (!this.photos[questionIndex]) {
  //       this.photos[questionIndex] = [];
  //     }
  
  //     if (image && image.base64String) {
  //       const fileName = `image_${this.questions[questionIndex].id}.jpg`;
  //       const uniqueFileName = `image_${this.questions[questionIndex].id}_${Date.now()}.jpg`; // Unique file name

  //       this.photos[questionIndex].push({
  //         url:uniqueFileName,
  //         name: fileName,
  //         base64: `data:image/jpeg;base64,${image.base64String}`
  //       });
  //     }
  
  //     console.log(this.photos);
  //   } catch (error) {
  //     console.error('Error capturing image:', error);
  //   }
  // }


  async captureImage(source: CameraSource, questionIndex: number) {
    try {
      const image = await Camera.getPhoto({
        quality: 60, // Lowered quality slightly for compression
        allowEditing: false,
        resultType: CameraResultType.Base64,
        source: source
      });
  
      console.log("Captured image:", image);
  
      if (!image || !image.base64String) return;
  
      const format = image.format || 'jpeg'; // Handle dynamic format (jpeg, png, etc.)
      const fileName = `image_${this.questions[questionIndex].id}.${format}`;
      const uniqueFileName = `image_${this.questions[questionIndex].id}_${Date.now()}.${format}`;
  
      this.photos[questionIndex] = [{ 
        url: uniqueFileName, 
        name: fileName, 
        base64: `data:image/${format};base64,${image.base64String}` 
      }];
  
      console.log("Updated photos array:", this.photos);
    } catch (error) {
      console.error("Error capturing image:", error);
    }
  }


  //-----------------------8april------------------
  feedbackImages: { base64: string, caption: string }[] = [];
  addFeedbackSection() {
    this.feedbackImages.push({ base64: '', caption: '' });
  }
  
  // selectFeedbackImage(index: number) {
  //   // Use Capacitor Camera or File input logic here
  //   // For example, using Capacitor Camera plugin:
  //   // import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
  
  //   Camera.getPhoto({
  //     quality: 80,
  //     allowEditing: false,
  //     resultType: CameraResultType.Base64,
  //     source: CameraSource.Prompt
  //   }).then(image => {
  //     const base64Data = 'data:image/jpeg;base64,' + image.base64String;
  //     this.feedbackImages[index].base64 = base64Data;
  //   }).catch(error => {
  //     console.error('Camera error:', error);
  //   });
  // }

  async selectFeedbackImage(index: number) {
    const actionSheet = await this.actionSheetController.create({
      header: 'Select Feedback Image Source',
      buttons: [
        {
          text: 'Camera',
          handler: () => {
            this.captureFeedbackImage(CameraSource.Camera, index);
          }
        },
        {
          text: 'Gallery',
          handler: () => {
            this.captureFeedbackImage(CameraSource.Photos, index);
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


  async captureFeedbackImage(source: CameraSource, index: number) {
    try {
      const image = await Camera.getPhoto({
        quality: 80,
        allowEditing: false,
        resultType: CameraResultType.Base64,
        source
      });
  
      this.feedbackImages[index].base64 = 'data:image/jpeg;base64,' + image.base64String;
    } catch (error) {
      console.error('Feedback image capture error:', error);
    }
  }
    
  
  

}
