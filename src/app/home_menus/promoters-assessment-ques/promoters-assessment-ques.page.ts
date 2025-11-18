import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Browser } from '@capacitor/browser';
import { ActionSheetController, AlertController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';
import { environment } from 'src/environments/environment';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { ElementRef, QueryList, ViewChildren } from '@angular/core';
import { timestamp } from 'rxjs';


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
  baseUrl: string = `${environment.baseUrl}/sony-erp/uploads/`;
  feedback: string = ''; 
   @ViewChildren('qRef') qRefs!: QueryList<ElementRef>;

hasTriedSubmit = false;
unansweredCount = 0;

// Separate container for feedback images
feedbackPhotos: { url: string; name: string; base64: string }[] = [];

// A question is “unanswered” if no radio is chosen
isUnanswered(q: any): boolean {
  return q?.selectedOption === null || q?.selectedOption === undefined;
}

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

  private scrollToFirstUnanswered(): void {
  // find first unanswered index
  const idx = this.questions.findIndex(q => this.isUnanswered(q));
  if (idx < 0) return;

  // use ViewChildren refs
  const el = this.qRefs?.toArray()?.[idx]?.nativeElement as HTMLElement;
  if (el && typeof el.scrollIntoView === 'function') {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}


fetchSpecialPromoterQuestions(categoryId: number, countryId: number) {
  this.apiService.getSpecialPromoterQuestions(categoryId, countryId).subscribe(
    response => {
      if (response && response.status) {
        // local descriptions fallback map (keyed by label or id if you prefer)
        const ratingDescByLabel: { [label: string]: string } = {
          'Very Bad': 'No implementation',
          'Bad': 'More than 3 are missing',
          'Fair': '2 items are missing',
          'Good': 'Only one item missing',
          'Very Good': 'Perfect !'
        };

        this.questions = response.data.map((q: any) => {
          const rawType = q.type_id ?? q.q_type;
          const t = (typeof rawType === 'string' && /^\d+$/.test(rawType)) ? Number(rawType) : rawType;

          let option_type = '';
          if (t === 4) {
            option_type = '4'; // rating
          } else if (t === 2) {
            option_type = '5'; // scale 1..5
          } else if (t === 3) {
            option_type = '4';
          } else {
            option_type = '';
          }

          // If backend already gives ratingOptions with descriptions use them; otherwise create fallback
          const ratingOptionsFromBackend = q.ratingOptions; // if API contains it
          const ratingOptions = ratingOptionsFromBackend && ratingOptionsFromBackend.length
            ? ratingOptionsFromBackend.map((ro: any) => ({
                id: ro.id,
                label: ro.label,
                description: ro.description ?? ratingDescByLabel[ro.label] ?? ''
              }))
            : [
                { id: 10, label: 'Very Bad', description: ratingDescByLabel['Very Bad'] },
                { id: 11, label: 'Bad', description: ratingDescByLabel['Bad'] },
                { id: 12, label: 'Fair', description: ratingDescByLabel['Fair'] },
                { id: 13, label: 'Good', description: ratingDescByLabel['Good'] },
                { id: 14, label: 'Very Good', description: ratingDescByLabel['Very Good'] }
              ];

          return {
            ...q,
            q_type: q.q_type,
            option_type,
            selectedOption: q.selectedOption ?? null,
            remarks: q.remarks || '',
            is_na: q.is_na ?? '0',
            ratingOptions, // now contains description
            scaleOptions: q.scaleOptions ?? [
              { id: 1, label: '1' },
              { id: 2, label: '2' },
              { id: 3, label: '3' },
              { id: 4, label: '4' },
              { id: 5, label: '5' }
            ],
            images: q.images || []
          };
        });

        console.log('Fetched Questions (normalized):', this.questions);
      } else {
        console.error('No questions found:', response && response.message);
        this.questions = [];
      }
    },
    error => {
      console.error('Error fetching questions:', error);
      this.questions = [];
    }
  );
}



  private getUnansweredIndices(): number[] {
  return this.questions
    .map((q, i) => (this.isUnanswered(q) ? i : -1))
    .filter(i => i !== -1);
}

onOptionChange(question: any, newVal: any) {
  if (newVal === null || newVal === undefined) {
    question.selectedOption = null;
    return;
  }
  // Convert numeric-string to number when needed
  if (typeof newVal === 'string' && /^\d+$/.test(newVal)) {
    question.selectedOption = +newVal;
  } else {
    question.selectedOption = newVal;
  }
}


private scrollThroughUnanswered(): void {
  const targets = this.getUnansweredIndices();
  if (!targets.length) return;

  const cards = this.qRefs?.toArray() || [];

  targets.forEach((idx, k) => {
    setTimeout(() => {
      const el = cards[idx]?.nativeElement as HTMLElement;
      if (!el) return;

      el.scrollIntoView({ behavior: 'smooth', block: 'start' });

      // Add a pulse/highlight to draw attention
      el.classList.add('pulse');
      setTimeout(() => el.classList.remove('pulse'), 1200);
    }, k * 900); // 900ms gap between each scroll for readability
  });
}


  evalId!:string;
submitAnswers() {
  this.hasTriedSubmit = true;
  this.unansweredCount = this.questions.reduce((acc, q) => acc + (this.isUnanswered(q) ? 1 : 0), 0);

  if (this.unansweredCount > 0) {
    // Show banner + scroll through ALL unanswered questions (sequentially)
    this.scrollThroughUnanswered();
    return; // Do NOT hit API while there are unanswered
  }

  const userIdString = localStorage.getItem('userId');
  const userId = userIdString ? Number(userIdString) : null;

  const payload = {
    storeId: this.storeId,
    userId: userId,
    promoterId: this.promoterId,
    categoryId: this.categoryId,
    feedback: this.feedback,
    questions: this.questions.map((question, index) => ({
      id: question.id,
      sel_option: question.selectedOption,
      remark: question.remarks || null,
      image: this.photos[index] ? this.photos[index] : []
    })),
    feedback_images: this.feedbackPhotos
    
  };

  console.log(payload);

  this.apiService.submitpromoterAnswers(payload).subscribe(
    async response => {
      console.log('Submission successful:', response);
      this.evalId = response.eval_id;
      await this.presentAlert();
    },
    error => {
      console.error('Error:', error);
    }
  );
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

async confirmAndSubmit() {
  // mark attempt and compute missing
  this.hasTriedSubmit = true;
  this.unansweredCount = this.questions.reduce((acc, q) => acc + (this.isUnanswered(q) ? 1 : 0), 0);

  // If anything is missing: show banner + red highlight + scroll, but NO confirm popup
  if (this.unansweredCount > 0) {
    this.scrollThroughUnanswered();
    return;
  }

  // All answered → now ask for confirmation
  const alert = await this.alertController.create({
    header: 'Are you sure you want to submit your audit?',
    cssClass: 'submit-confirm',
    buttons: [
      { text: 'no', role: 'cancel' },
      { text: 'yes', handler: () => { this.submitAnswers(); } }
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
      { text: 'Camera',  handler: () => this.captureImage(CameraSource.Camera, 'question', questionIndex) },
      { text: 'Gallery', handler: () => this.captureImage(CameraSource.Photos, 'question', questionIndex) },
      { text: 'Cancel',  role: 'cancel' }
    ]
  });
  await actionSheet.present();
}

// Feedback-only picker (no extra text/button in UI — just the icon triggers this)
async selectFeedbackImage() {
  const actionSheet = await this.actionSheetController.create({
    header: 'Select Image Source',
    buttons: [
      { text: 'Camera',  handler: () => this.captureImage(CameraSource.Camera, 'feedback') },
      { text: 'Gallery', handler: () => this.captureImage(CameraSource.Photos, 'feedback') },
      { text: 'Cancel',  role: 'cancel' }
    ]
  });
  await actionSheet.present();
}

async captureImage(source: CameraSource, target: 'question' | 'feedback', questionIndex?: number) {
  try {
    const image = await Camera.getPhoto({
      quality: 60,
      allowEditing: false,
      resultType: CameraResultType.Base64,
      source: source
    });

    if (!image || !image.base64String) return;

    const format = image.format || 'jpeg';
    const now = Date.now();
    const base64 = `data:image/${format};base64,${image.base64String}`;

    if (target === 'question' && typeof questionIndex === 'number') {
      // ensure array exists
      if (!this.photos[questionIndex]) this.photos[questionIndex] = [];
      // push (multiple)
      this.photos[questionIndex].push({
        url: `image_${this.questions[questionIndex].id}_${now}.${format}`,
        name: `image_${this.questions[questionIndex].id}.${format}`,
        base64
      });
    } else {
      // feedback images (multiple)
      this.feedbackPhotos.push({
        url: `feedback_${now}.${format}`,
        name: `feedback_${now}.${format}`,
        base64
      });
    }

    console.log('Updated photos array:', this.photos);
    console.log('Feedback photos:', this.feedbackPhotos);
  } catch (error) {
    console.error('Error capturing image:', error);
  }
}


}
