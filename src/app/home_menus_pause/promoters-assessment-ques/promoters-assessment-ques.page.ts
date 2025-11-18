import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Browser } from '@capacitor/browser';
import { ActionSheetController, AlertController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';
import { environment } from 'src/environments/environment';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';


@Component({
  selector: 'app-promoters-assessment-ques',
  templateUrl: './promoters-assessment-ques.page.html',
  styleUrls: ['./promoters-assessment-ques.page.scss'],
})
export class PromotersAssessmentQuesPage implements OnInit {

  categoryId!: number;
  countryId!: number;
  promoterId!: number;
  storeId!: number;
  photos: { url:string,name:string,base64:string }[][] = [];


  questions: any[] = []; // To store the fetched questions
  errorMessage: string | undefined;
  baseUrl: string = `${environment.baseUrl}/happyproject/uploads/`;
  feedback: string = ''; 



  constructor(private actionSheetController: ActionSheetController,private route: ActivatedRoute,private apiService:ApiService,private router: Router,private alertController: AlertController) {}

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.categoryId = params['categoryId'];
      this.countryId = params['countryId'];
      this.promoterId = params['promoterId'];
      this.storeId = params['storeId'];

      console.log('Category ID:', this.categoryId);
      console.log('Country ID:', this.countryId);

      // Call the API to fetch special promoter questions
      this.fetchSpecialPromoterQuestions(this.categoryId, this.countryId);
    });
  }

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

  fetchSpecialPromoterQuestions(categoryId: number, countryId: number) {
    this.apiService.getSpecialPromoterQuestions(categoryId, countryId).subscribe(
      response => {
        if (response.status) {
          this.questions = response.data; // Store the fetched questions
          console.log('Fetched Questions:', this.questions);
        } else {
          console.error('No questions found:', response.message);
          this.errorMessage = response.message; // Handle no questions found
        }
      },
      error => {
        console.error('Error fetching questions:', error);
        this.errorMessage = 'An error occurred while fetching questions.';
      }
    );
  }

  evalId!:string;
  submitAnswers() {
    const userIdString = localStorage.getItem('userId');
      const userId = userIdString ? Number(userIdString) : null;
      
    const payload = {
      storeId: this.storeId, 
      userId: userId, 
      promoterId: this.promoterId, 
      categoryId: this.categoryId, 
      feedback:this.feedback,
      // questions: this.questions.map(question => ({
        questions: this.questions.map((question, index) => ({
        id: question.id,
        sel_option: question.selectedOption,
        remark: question.remarks || null,
        image: this.photos[index] ? this.photos[index] : [] // Pass images for each question
      }))
    };

    console.log(payload);

    this.apiService.submitpromoterAnswers(payload).subscribe(
      async response => {
        console.log('Response:', response);
        // Handle success response here
        console.log('Submission successful:', response);
        // Handle success response here (e.g., show a success message)
        this.evalId = response.eval_id;
         // Show alert on successful submission
         await this.presentAlert();
      },
      error => {
        console.error('Error:', error);
        // Handle error response here
      }
    );
  }


//   async presentAlert() {
//     const alert = await this.alertController.create({
//         header: 'Success',
//         message: 'Submit successfully',
//         buttons: [
//             {
//                 text: 'OK',
//                 handler: () => {
//                     this.router.navigate(['/home']); // Redirect to home page
//                 }
//             }
//         ]
//     });

//     await alert.present();
// }

async presentAlert() {
  const alert = await this.alertController.create({
    header: 'Success',
    message: 'Submit successfully. Do you want to submit feedback photo as well?',
    buttons: [
      {
        text: 'Back',
        handler: () => {
          this.router.navigate(['/home']);
        }
      },
      {
        text: 'OK',
        handler: () => {
          this.feedphoto();
        }
      }
    ]
  });

  await alert.present();
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

//   async presentAlert() {
//     const alert = await this.alertController.create({
//         header: 'Success',
//         message: 'Do you want to submit feedback?',
//         buttons: [
//             {
//                 text: 'No',
//                 handler: () => {
//                     this.router.navigate(['/home']); // Redirect to home page
//                 }
//             },
//             {
//                 text: 'Yes',
//                 handler: () => {
//                     this.feedphoto(); // Call feedphoto function on Yes button click
//                 }
//             }
//         ]
//     });

//     await alert.present();
// }

  feedphoto() {
    // Your feedphoto function implementation
    console.log('Feed photo function called');
    this.router.navigate(['/daily-vmdchecklist-feedphoto'], {
      queryParams: {
        categoryId: this.categoryId,
        evalId: this.evalId,
        s: "p"//source:promoter
      }
    });
  }

   // Check if all questions have at least one radio button selected
   areAllQuestionsAnswered(): boolean {
    // return this.questions.every(question => question.sel_option !== undefined);
    // return true;
    return this.questions.every(question => question.selectedOption !== null && question.selectedOption !== undefined);
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

}
