
  import { Component, OnInit, ElementRef, QueryList, ViewChildren } from '@angular/core';
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
  // add inside the class (near other fields)
  hasTriedSubmit = false;
  unansweredCount = 0;
  trackByQuestion(index: number, item: any) {
  return item?.id ?? index;
}

  baseUrl: string = `${environment.baseUrl}/sony-erp/uploads/`;
  feedback: string = ''; 
  @ViewChildren('questionCard') questionCards!: QueryList<ElementRef>;
unansweredSet: Set<number> = new Set<number>();


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
/**
 * Ensure selectedOption is stored as a number (ion-radio can emit string values).
 * Call this from template via (ngModelChange)="onOptionChange(question, $event)"
 */
onOptionChange(question: any, newVal: any) {
  if (newVal === null || newVal === undefined) {
    question.selectedOption = null;
    return;
  }

  // If ion-radio returns string numeric, convert to number
  if (typeof newVal === 'string' && /^\d+$/.test(newVal)) {
    question.selectedOption = +newVal;
  } else {
    question.selectedOption = newVal;
  }
}


loadSpecialQuestions() {
  const catId = +this.categoryId;
  const countryId = +this.countryId;
  this.apiService.getSpecialQuestions(catId, countryId).subscribe((response) => {
    if (response && response.status) {
      // Map incoming questions to template-friendly structure
      this.questions = response.data.map((q: any) => {
        // map q_type to option_type used by template
        let option_type = '';
        if (q.q_type === '3' || q.q_type === 3) {
          option_type = '4'; // rating (Very Bad -> Very Good)
        } else if (q.q_type === '2' || q.q_type === 2) {
          option_type = '5'; // scale 1..5 (percentage style)
        } else {
          option_type = '';  // default Yes/No/NA block
        }
        const selectedOption: any = null;

        // default rating options (if needed)
        const ratingOptions = [
          { id: 10, label: 'Very Bad', description: 'No implementation' },
          { id: 11, label: 'Bad',      description: 'More than 3 are missing' },
          { id: 12, label: 'Fair',     description: '2 items are missing' },
          { id: 13, label: 'Good',     description: 'Only one item missing' },
          { id: 14, label: 'Very Good',description: 'Perfect !' }
        ];
        const scaleOptions = [
          { id: 1, label: '1' },
          { id: 2, label: '2' },
          { id: 3, label: '3' },
          { id: 8, label: '4' },
          { id: 9, label: '5' }
        ];

        // Build final question object used by template
        return {
          ...q,
          q_type: q.q_type,
          option_type,
          selectedOption,
          remarks: q.remarks || '',
          images: q.images || [],
          ratingOptions: q.ratingOptions || ratingOptions,
          scaleOptions: q.scaleOptions || scaleOptions
        };
      });

      console.log('Mapped questions (first 5):', this.questions.slice(0, 5));
    } else {
      console.warn('getSpecialQuestions returned false or unexpected response', response);
      this.questions = [];
    }
  }, err => {
    console.error('Error fetching special questions', err);
    this.questions = [];
  });
}




  // Compute unanswered question indices (by selectedOption)
getUnansweredIndices(): number[] {
  return this.questions
    .map((q, idx) =>
      (q?.selectedOption === null || q?.selectedOption === undefined) ? idx : -1
    )
    .filter(idx => idx !== -1);
}

// Smooth-scroll to a question-card by index
scrollToQuestion(index: number) {
  const el = this.questionCards?.toArray()[index]?.nativeElement;
  if (el && el.scrollIntoView) {
    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
}


private scrollThroughUnanswered(): void {
  // get indexes
  const targets = this.getUnansweredIndices();
  if (!targets.length) return;

  const cards = this.questionCards?.toArray() || [];

  targets.forEach((idx, k) => {
    setTimeout(() => {
      const el = cards[idx]?.nativeElement as HTMLElement;
      if (!el) return;

      // scroll into view
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });

      // pulse highlight for visibility
      el.classList.add('pulse');
      setTimeout(() => el.classList.remove('pulse'), 1200);

      // ensure the last unanswered card stays marked visually (keeps red)
      if (k === targets.length - 1) {
        el.classList.add('unanswered');
      }
    }, k * 900); // 900ms between scrolls
  });
}

async onSubmitClick() {
  // mark that user tried submit
  this.hasTriedSubmit = true;

  // compute unanswered count
  const unanswered = this.getUnansweredIndices();
  this.unansweredCount = unanswered.length;

  // if any unanswered -> show banner + sequential scroll; do NOT open confirm dialog
  if (unanswered.length > 0) {
    // populate unansweredSet for class bindings if you want to keep it
    this.unansweredSet = new Set(unanswered);

    // show an alert briefly (optional). Promoter version does not show modal;
    // it only shows banner + scroll. We keep banner (in template changes below).
    this.scrollThroughUnanswered();
    return;
  }

  // All answered -> show confirmation modal then submit
  const confirm = await this.alertController.create({
    header: 'Confirm Submit',
    message: 'Are you sure you want to submit your audit?',
    buttons: [
      { text: 'Cancel', role: 'cancel' },
      { text: 'Submit', handler: () => this.submitAnswers() }
    ]
  });
  await confirm.present();
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

  // Basic validation: ensure all questions answered
  const unanswered = this.questions.findIndex(q => q.selectedOption === null || q.selectedOption === undefined);
  if (unanswered !== -1) {
    // you may show a toast/alert - but keep behavior consistent with your onSubmitClick flow
    console.warn('Please answer all questions before submit. First unanswered index:', unanswered);
    // Optionally scroll to first unanswered:
    this.scrollToQuestion(unanswered);
    return;
  }

  const payload: any = {
    storeId: this.storeId,
    userId: userId,
    categoryId: +this.categoryId,
    feedback: this.feedback || '',
    questions: this.questions.map((q, index) => {
      return {
        id: q.id,
        // ensure numeric sel_option (API expects numbers in sample)
        sel_option: (q.selectedOption !== null && q.selectedOption !== undefined) ? +q.selectedOption : null,
        remark: q.remarks || '',
        // send images array (each image object contains url,name,base64)
        images: Array.isArray(this.photos[index]) ? this.photos[index] : []
      };
    }),
    // `feedback_images` top-level: array of base64 strings or objects depending on API
    feedback_images: (this.feedbackImages || []).map(fi => {
      // If your API expects raw base64 strings:
      if (fi.images && fi.images.length) {
        // return array of base64 strings (you used feedback payload sample with strings)
        return fi.images[0]; // If you want to support multiple, adapt accordingly
      }
      return fi.base64 || null;
    }).filter(x => x !== null)
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

// OLD (checked feedback)
// return allQuestionsAnswered && allFeedbackValid;

// NEW (images optional, feedback optional)
areAllQuestionsAnswered(): boolean {
  return this.questions.every(
    q => q.selectedOption !== null && q.selectedOption !== undefined
  );
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


// NEW: allow multiple images per question
    async captureImage(source: CameraSource, questionIndex: number) {
    try {
    const image = await Camera.getPhoto({
      quality: 60,
      allowEditing: false,
      resultType: CameraResultType.Base64,
      source
    });

    if (!image || !image.base64String) return;

    const format = image.format || 'jpeg';
    const fileName = `image_${this.questions[questionIndex].id}.${format}`;
    const uniqueFileName = `image_${this.questions[questionIndex].id}_${Date.now()}.${format}`;

    if (!this.photos[questionIndex]) this.photos[questionIndex] = [];

    this.photos[questionIndex].push({
      url: uniqueFileName,
      name: fileName,
      base64: `data:image/${format};base64,${image.base64String}`
    });

    console.log("Updated photos array:", this.photos);
  } catch (error) {
    console.error("Error capturing image:", error);
  }
}

// NEW: remove a single question image
removeQuestionImage(qIndex: number, imgIndex: number) {
  this.photos[qIndex].splice(imgIndex, 1);
}



  //-----------------------8april------------------
  feedbackImages: {
    base64: any; caption: string, images: string[] 
}[] = [];
  addFeedbackSection() {
  this.feedbackImages.push({
    caption: '', images: [],
    base64: undefined
  });  
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

    const base64 = 'data:image/jpeg;base64,' + image.base64String;
    this.feedbackImages[index].images.push(base64);
  } catch (error) {
    console.error('Feedback image capture error:', error);
  }
}

// NEW: remove a single feedback image
removeFeedbackImage(feedbackIndex: number, imgIndex: number) {
  this.feedbackImages[feedbackIndex].images.splice(imgIndex, 1);
}
}
