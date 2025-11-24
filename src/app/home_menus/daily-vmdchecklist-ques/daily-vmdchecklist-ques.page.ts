import { Component, OnInit, ElementRef, QueryList, ViewChildren } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ActionSheetController, AlertController, ToastController } from '@ionic/angular';
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
  userData: any = {};
  questions: any[] = [];
  selectedStoreId!: number;
  userId!: number;
  categoryId!: string;
  countryId!: string;
  storeId!: string;
  photos: { url: string; name: string; base64: string }[][] = [];
  hasTriedSubmit = false;
  unansweredCount = 0;

  baseUrl: string = `${environment.baseUrl}/sony-erp/uploads/`;
  feedback: string = '';

  @ViewChildren('questionCard') questionCards!: QueryList<ElementRef>;
  unansweredSet: Set<number> = new Set<number>();
  private _activeToast: HTMLIonToastElement | null = null;
  private _unansweredScrollTimers: any[] = [];

  // FIXED: Correct scale IDs matching the database table (1,2,3,8,9)
  scaleOptions = [
    { id: 1, label: '1' },
    { id: 2, label: '2' },
    { id: 3, label: '3' },
    { id: 8, label: '4' }, // NOT 7!
    { id: 9, label: '5' }  // NOT 8!
  ];

  // FIXED: Correct rating IDs matching the database table (10-14)
  ratingOptions = [
    { id: 10, label: 'Very Bad', description: 'No implementation' },
    { id: 11, label: 'Bad', description: 'More than 3 are missing' },
    { id: 12, label: 'Fair', description: '2 items are missing' },
    { id: 13, label: 'Good', description: 'Only one item missing' },
    { id: 14, label: 'Very Good', description: 'Perfect!' }
  ];

  trackByQuestion(index: number, item: any) {
    return item?.id ?? index;
  }

  constructor(
    private apiService: ApiService,
    private route: ActivatedRoute,
    private alertController: AlertController,
    private router: Router,
    private actionSheetController: ActionSheetController,
    private toastController: ToastController
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.categoryId = params['categoryId'];
      this.countryId = params['countryId'];
      this.storeId = params['storeId'];

      console.log('Category ID:', this.categoryId);
      console.log('Country ID:', this.countryId);
      console.log('Store ID:', this.storeId);
    });
    this.loadSpecialQuestions();
  }

  onOptionChange(question: any, newVal: any) {
    // Convert string to number if needed
    if (typeof newVal === 'string' && /^\d+$/.test(newVal)) {
      question.selectedOption = Number(newVal);
    } else {
      question.selectedOption = newVal === '' ? null : newVal;
    }

    // Update unanswered tracking
    const unansweredIndices = this.getUnansweredIndices();
    this.unansweredSet = new Set(unansweredIndices);
    this.unansweredCount = unansweredIndices.length;

    // Remove unanswered class if question is now answered
    const cards = this.questionCards?.toArray() || [];
    const qIndex = this.questions.indexOf(question);
    const cardEl = cards[qIndex]?.nativeElement as HTMLElement | undefined;
    if (cardEl && !this.isUnanswered(question)) {
      cardEl.classList.remove('unanswered');
    }

    // Show toast with remaining count
    if (this.hasTriedSubmit) {
      this.presentUnansweredToast(this.unansweredCount);
    }
  }

  loadSpecialQuestions() {
    const catId = +this.categoryId;
    const countryId = +this.countryId;

    if (!catId || !countryId) {
      console.warn('Missing categoryId or countryId');
      this.questions = [];
      this.photos = [];
      return;
    }

    this.apiService.getSpecialQuestions(catId, countryId).subscribe(
      (response) => {
        if (response && response.status) {
          // Map questions with correct option types
          this.questions = response.data.map((q: any) => {
            const type_id = String(q.type_id ?? q.q_type ?? '');
            let option_type = '';

            // Map question types to option_type for template
            if (type_id === '4' || q.q_type === '3' || q.q_type === 3) {
              option_type = '4'; // rating (Very Bad -> Very Good)
            } else if (type_id === '2' || q.q_type === '2' || q.q_type === 2) {
              option_type = '5'; // scale 1..5 (percentage style)
            } else {
              option_type = ''; // default Yes/No/NA
            }

            return {
              ...q,
              type_id: type_id,
              q_type: q.q_type ?? '',
              option_type,
              selectedOption: null,
              remarks: q.remarks || '',
              images: q.images || [],
              // Use class-level arrays with correct IDs
              ratingOptions: this.ratingOptions,
              scaleOptions: this.scaleOptions
            };
          });

          this.photos = this.questions.map(() => []);

          console.log('Mapped questions:', this.questions.slice(0, 3));

          // Auto-scroll to first unanswered after load
          setTimeout(() => {
            const firstUnanswered = this.getUnansweredIndices()[0];
            if (typeof firstUnanswered === 'number') {
              this.scrollToQuestion(firstUnanswered);
              const unansweredIndices = this.getUnansweredIndices();
              this.unansweredSet = new Set(unansweredIndices);
              this.unansweredCount = unansweredIndices.length;
            }
          }, 120);
        } else {
          console.warn('getSpecialQuestions returned false or unexpected response', response);
          this.questions = [];
        }
      },
      (err) => {
        console.error('Error fetching special questions', err);
        this.questions = [];
        this.alertController.create({
          header: 'Error',
          message: 'Unable to load questions. Please try again later.',
          buttons: ['OK']
        }).then(a => a.present());
      }
    );
  }

  isUnanswered(question: any): boolean {
    return question.selectedOption === null || question.selectedOption === undefined;
  }

  getUnansweredIndices(): number[] {
    return this.questions
      .map((q, idx) => this.isUnanswered(q) ? idx : -1)
      .filter(idx => idx !== -1);
  }

  scrollToQuestion(index: number) {
    const el = this.questionCards?.toArray()[index]?.nativeElement;
    if (el && el.scrollIntoView) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }

  private _clearUnansweredTimers() {
    this._unansweredScrollTimers.forEach(t => clearTimeout(t));
    this._unansweredScrollTimers = [];
  }

  private async scrollThroughUnanswered(): Promise<void> {
    this._clearUnansweredTimers();

    const targets = this.getUnansweredIndices();
    if (!targets.length) return;

    const cards = this.questionCards?.toArray() || [];

    targets.forEach((idx, k) => {
      const t = setTimeout(() => {
        const el = cards[idx]?.nativeElement as HTMLElement;
        if (!el) return;

        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        el.classList.add('pulse');
        setTimeout(() => el.classList.remove('pulse'), 1200);

        if (k === targets.length - 1) {
          el.classList.add('unanswered');
        }
      }, k * 900);
      this._unansweredScrollTimers.push(t);
    });
  }

  private async presentUnansweredToast(count: number) {
    try {
      if (this._activeToast) await this._activeToast.dismiss();
    } catch (e) {}

    const message = count > 0 ? `${count} unanswered remaining` : 'All questions answered';
    const toast = await this.toastController.create({
      message,
      duration: 1600,
      position: 'bottom',
      cssClass: 'unanswered-toast'
    });
    this._activeToast = toast;
    await toast.present();

    setTimeout(() => (this._activeToast = null), 1700);
  }

  async onSubmitClick() {
    this.hasTriedSubmit = true;
    const unanswered = this.getUnansweredIndices();
    this.unansweredSet = new Set(unanswered);
    this.unansweredCount = unanswered.length;

    if (unanswered.length > 0) {
      this._clearUnansweredTimers();
      await this.scrollThroughUnanswered();
      this.presentUnansweredToast(unanswered.length);
      return;
    }

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

  async openImageInBrowser(url: string) {
    try {
      await Browser.open({
        url: url,
        toolbarColor: '#000000',
        presentationStyle: 'fullscreen'
      });
    } catch (error) {
      console.error('Error opening in-app browser:', error);
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
          }
        },
        {
          text: 'Back',
          handler: () => {
            this.router.navigate(['/home']);
          }
        }
      ]
    });

    await alert.present();
  }

  evalId!: string;

  submitAnswers() {
    const userIdString = localStorage.getItem('userId');
    const userId = userIdString ? Number(userIdString) : null;

    // Validate all questions answered
    const unanswered = this.questions.findIndex(q => this.isUnanswered(q));
    if (unanswered !== -1) {
      console.warn('Please answer all questions before submit. First unanswered index:', unanswered);
      this.scrollToQuestion(unanswered);
      return;
    }

    // FIXED: No ID mapping needed - using correct IDs from the start
    const payload: any = {
      storeId: this.storeId,
      userId: userId,
      categoryId: +this.categoryId,
      feedback: this.feedback || '',
      questions: this.questions.map((q, index) => {
        return {
          id: q.id,
          // Send correct IDs: 1-9 for scale, 10-14 for rating, 4-6 for yes/no
          sel_option: (q.selectedOption !== null && q.selectedOption !== undefined) ? +q.selectedOption : null,
          remark: q.remarks || '',
          images: Array.isArray(this.photos[index]) ? this.photos[index] : []
        };
      }),
      feedback_images: (this.feedbackImages || [])
        .map(fi => {
          if (fi.images && fi.images.length) {
            return fi.images[0];
          }
          return fi.base64 || null;
        })
        .filter(x => x !== null)
    };

    console.log('Submitting payload:', payload);

    this.apiService.postChecklistAnswers(payload).subscribe(
      async (response) => {
        console.log('Submission successful:', response);
        this.evalId = response.eval_id;
        await this.presentAlert();
      },
      async (error) => {
        console.error('Error submitting answers:', error);
        const alert = await this.alertController.create({
          header: 'Error',
          message: error?.error?.message ?? 'Failed to submit answers. Please try again.',
          buttons: ['OK']
        });
        alert.present();
      }
    );
  }

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
            this.router.navigate(['/home']);
          }
        }
      ]
    });

    await alert.present();
  }

  feedphoto() {
    console.log('Feed photo function called');
    this.router.navigate(['/daily-vmdchecklist-feedphoto'], {
      queryParams: {
        categoryId: this.categoryId,
        evalId: this.evalId,
        s: 'v'
      }
    });
  }

  areAllQuestionsAnswered(): boolean {
    return this.questions.every(q => !this.isUnanswered(q));
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

      console.log('Updated photos array:', this.photos);
    } catch (error) {
      console.error('Error capturing image:', error);
    }
  }

  removeQuestionImage(qIndex: number, imgIndex: number) {
    this.photos[qIndex].splice(imgIndex, 1);
  }

  feedbackImages: {
    base64: any;
    caption: string;
    images: string[];
  }[] = [];

  addFeedbackSection() {
    this.feedbackImages.push({
      caption: '',
      images: [],
      base64: undefined
    });
  }

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

  removeFeedbackImage(feedbackIndex: number, imgIndex: number) {
    this.feedbackImages[feedbackIndex].images.splice(imgIndex, 1);
  }
}