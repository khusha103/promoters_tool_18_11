import { Component, OnInit, ElementRef, QueryList, ViewChildren } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Browser } from '@capacitor/browser';
import { ActionSheetController, AlertController, ToastController } from '@ionic/angular';
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
  photos: { url: string; name: string; base64: string }[][] = [];

  questions: any[] = [];
  errorMessage: string | undefined;
  baseUrl: string = `${environment.baseUrl}/sony-erp/uploads/`;
  feedback: string = '';

  @ViewChildren('qRef') qRefs!: QueryList<ElementRef>;

  hasTriedSubmit = false;
  unansweredCount = 0;
  private _activeToast: HTMLIonToastElement | null = null;
  private _unansweredScrollTimers: any[] = [];

  // Separate container for feedback images
  feedbackPhotos: { url: string; name: string; base64: string }[] = [];

  // FIXED: Correct scale IDs from database (1,2,3,8,9)
  scaleOptions = [
    { id: 1, label: '1' },
    { id: 2, label: '2' },
    { id: 3, label: '3' },
    { id: 8, label: '4' }, // NOT 7!
    { id: 9, label: '5' }  // NOT 8!
  ];

  // FIXED: Correct rating IDs from database (10-14)
  ratingOptions = [
    { id: 10, label: 'Very Bad', description: 'No implementation' },
    { id: 11, label: 'Bad', description: 'More than 3 are missing' },
    { id: 12, label: 'Fair', description: '2 items are missing' },
    { id: 13, label: 'Good', description: 'Only one item missing' },
    { id: 14, label: 'Very Good', description: 'Perfect!' }
  ];

  // A question is "unanswered" if no radio is chosen
  isUnanswered(q: any): boolean {
    return q?.selectedOption === null || q?.selectedOption === undefined;
  }

  constructor(
    private actionSheetController: ActionSheetController,
    private route: ActivatedRoute,
    private apiService: ApiService,
    private router: Router,
    private alertController: AlertController,
    private toastController: ToastController
  ) {}

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.categoryId = params['categoryId'];
      this.countryId = params['countryId'];
      this.promoterId = params['promoterId'];
      this.storeId = params['storeId'];

      console.log('Category ID:', this.categoryId);
      console.log('Country ID:', this.countryId);
      console.log('Promoter ID:', this.promoterId);
      console.log('Store ID:', this.storeId);

      this.fetchSpecialPromoterQuestions(this.categoryId, this.countryId);
    });
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

  private scrollToFirstUnanswered(): void {
    const idx = this.questions.findIndex(q => this.isUnanswered(q));
    if (idx < 0) return;

    const el = this.qRefs?.toArray()?.[idx]?.nativeElement as HTMLElement;
    if (el && typeof el.scrollIntoView === 'function') {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }

  fetchSpecialPromoterQuestions(categoryId: number, countryId: number) {
    this.apiService.getSpecialPromoterQuestions(categoryId, countryId).subscribe(
      response => {
        if (response && response.status) {
          this.questions = response.data.map((q: any) => {
            const rawType = q.type_id ?? q.q_type;
            const t = (typeof rawType === 'string' && /^\d+$/.test(rawType)) ? Number(rawType) : rawType;

            let option_type = '';
            if (t === 4 || t === 3) {
              option_type = '4'; // rating
            } else if (t === 2) {
              option_type = '5'; // scale 1..5
            } else {
              option_type = ''; // yes/no/na
            }

            // Use class-level arrays with correct IDs
            return {
              ...q,
              q_type: q.q_type,
              type_id: String(q.type_id ?? q.q_type ?? ''),
              option_type,
              selectedOption: q.selectedOption ?? null,
              remarks: q.remarks || '',
              is_na: q.is_na ?? '0',
              // Use class-level options with correct database IDs
              ratingOptions: this.ratingOptions,
              scaleOptions: this.scaleOptions,
              images: q.images || []
            };
          });

          this.photos = this.questions.map(() => []);

          console.log('Fetched Questions (normalized):', this.questions.slice(0, 3));

          // Auto-scroll to first unanswered after load
          setTimeout(() => {
            const firstUnanswered = this.getUnansweredIndices()[0];
            if (typeof firstUnanswered === 'number') {
              this.scrollToFirstUnanswered();
            }
          }, 120);
        } else {
          console.error('No questions found:', response && response.message);
          this.questions = [];
        }
      },
      error => {
        console.error('Error fetching questions:', error);
        this.questions = [];
        this.alertController.create({
          header: 'Error',
          message: 'Unable to load questions. Please try again later.',
          buttons: ['OK']
        }).then(a => a.present());
      }
    );
  }

  private getUnansweredIndices(): number[] {
    return this.questions
      .map((q, i) => (this.isUnanswered(q) ? i : -1))
      .filter(i => i !== -1);
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
    this.unansweredCount = unansweredIndices.length;

    // Remove unanswered class if answered
    const cards = this.qRefs?.toArray() || [];
    const qIndex = this.questions.indexOf(question);
    const cardEl = cards[qIndex]?.nativeElement as HTMLElement | undefined;
    if (cardEl && !this.isUnanswered(question)) {
      cardEl.classList.remove('unanswered');
    }

    // Show toast if user has tried submit
    if (this.hasTriedSubmit) {
      this.presentUnansweredToast(this.unansweredCount);
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

    const cards = this.qRefs?.toArray() || [];

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

  evalId!: string;

  // FIXED: No ID mapping needed - using correct IDs from the start
  submitAnswers() {
    this.hasTriedSubmit = true;
    this.unansweredCount = this.questions.reduce((acc, q) => acc + (this.isUnanswered(q) ? 1 : 0), 0);

    if (this.unansweredCount > 0) {
      this.scrollThroughUnanswered();
      this.presentUnansweredToast(this.unansweredCount);
      return;
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
        // Send correct IDs: 1-9 for scale, 10-14 for rating, 4-6 for yes/no
        sel_option: question.selectedOption,
        remark: question.remarks || null,
        image: this.photos[index] ? this.photos[index] : []
      })),
      feedback_images: this.feedbackPhotos
    };

    console.log('Submitting payload:', payload);

    this.apiService.submitpromoterAnswers(payload).subscribe(
      async response => {
        console.log('Submission successful:', response);
        this.evalId = response.eval_id;
        await this.presentAlert();
      },
      async error => {
        console.error('Error:', error);
        const alert = await this.alertController.create({
          header: 'Error',
          message: error?.error?.message ?? 'Failed to submit answers. Please try again.',
          buttons: ['OK']
        });
        alert.present();
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
            this.router.navigate(['/home']);
          }
        }
      ]
    });

    await alert.present();
  }

  async confirmAndSubmit() {
    this.hasTriedSubmit = true;
    this.unansweredCount = this.questions.reduce((acc, q) => acc + (this.isUnanswered(q) ? 1 : 0), 0);

    if (this.unansweredCount > 0) {
      this.scrollThroughUnanswered();
      this.presentUnansweredToast(this.unansweredCount);
      return;
    }

    const alert = await this.alertController.create({
      header: 'Confirm Submit',
      message: 'Are you sure you want to submit your audit?',
      cssClass: 'submit-confirm',
      buttons: [
        { text: 'No', role: 'cancel' },
        { text: 'Yes', handler: () => { this.submitAnswers(); } }
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

  feedphoto() {
    console.log('Feed photo function called');
    this.router.navigate(['/daily-vmdchecklist-feedphoto'], {
      queryParams: {
        categoryId: this.categoryId,
        evalId: this.evalId,
        s: 'p' // source: promoter
      }
    });
  }

  areAllQuestionsAnswered(): boolean {
    return this.questions.every(question => !this.isUnanswered(question));
  }

  async selectImage(questionIndex: number) {
    const actionSheet = await this.actionSheetController.create({
      header: 'Select Image Source',
      buttons: [
        { text: 'Camera', handler: () => this.captureImage(CameraSource.Camera, 'question', questionIndex) },
        { text: 'Gallery', handler: () => this.captureImage(CameraSource.Photos, 'question', questionIndex) },
        { text: 'Cancel', role: 'cancel' }
      ]
    });
    await actionSheet.present();
  }

  async selectFeedbackImage() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Select Image Source',
      buttons: [
        { text: 'Camera', handler: () => this.captureImage(CameraSource.Camera, 'feedback') },
        { text: 'Gallery', handler: () => this.captureImage(CameraSource.Photos, 'feedback') },
        { text: 'Cancel', role: 'cancel' }
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
        if (!this.photos[questionIndex]) this.photos[questionIndex] = [];
        this.photos[questionIndex].push({
          url: `image_${this.questions[questionIndex].id}_${now}.${format}`,
          name: `image_${this.questions[questionIndex].id}.${format}`,
          base64
        });
      } else {
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

  // Add remove methods for multiple images
  removeQuestionImage(qIndex: number, imgIndex: number) {
    this.photos[qIndex].splice(imgIndex, 1);
  }

  removeFeedbackImage(imgIndex: number) {
    this.feedbackPhotos.splice(imgIndex, 1);
  }
}