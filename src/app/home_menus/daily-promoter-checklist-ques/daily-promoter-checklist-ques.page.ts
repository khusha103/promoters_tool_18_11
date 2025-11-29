import { Component, OnInit, ElementRef, QueryList, ViewChildren } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ActionSheetController, AlertController, ToastController } from '@ionic/angular';
import { Browser } from '@capacitor/browser';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

import { ApiService } from 'src/app/services/api.service';

interface ChecklistQuestion {
  option_type: any;
  type_id: any;
  scaleOptions: any;
  ratingOptions: any;
  id: number;
  body: string;
  file_name?: string;
  is_na?: '0' | '1';
  selectedOption: number | null;
  remarks: string;
}

@Component({
  selector: 'app-daily-promoter-checklist-ques',
  templateUrl: './daily-promoter-checklist-ques.page.html',
  styleUrls: ['./daily-promoter-checklist-ques.page.scss'],
})
export class DailyPromoterChecklistQuesPage implements OnInit {

  categoryId!: string;
  countryId!: string;
  storeId!: string;
  promoterId!: string | null;
  hasTriedSubmit = false;
  unansweredCount = 0;

  questions: ChecklistQuestion[] = [];
  photos: { url: string; name: string; base64: string }[][] = [];
  feedback: string = '';
  feedbackImages: { caption: string; images: string[] }[] = [];
  baseUrl: any;

  trackByQuestion(index: number, item: ChecklistQuestion) {
    return item?.id ?? index;
  }

  @ViewChildren('qRef', { read: ElementRef }) questionCards!: QueryList<ElementRef>;

  unansweredSet: Set<number> = new Set<number>();
  private _unansweredScrollTimers: any[] = [];

  private _clearUnansweredTimers() {
    this._unansweredScrollTimers.forEach(t => clearTimeout(t));
    this._unansweredScrollTimers = [];
  }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private alertController: AlertController,
    private actionSheetController: ActionSheetController,
    private toastController: ToastController,
    private apiService: ApiService
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.categoryId = params['categoryId'];
      this.countryId  = params['countryId'];
      this.storeId    = params['storeId'];
      this.promoterId = params['promoterId'] ?? localStorage.getItem('promoterId') ?? localStorage.getItem('userId') ?? null;

      console.log('Init params:', { categoryId: this.categoryId, countryId: this.countryId, storeId: this.storeId, promoterId: this.promoterId });

      this.loadQuestionsFromApi();
    });
  }

  // FIXED: Scale options now use correct IDs from table (1,2,3,8,9)
  scaleOptions = [
    { id: 1, label: '1' },
    { id: 2, label: '2' },
    { id: 3, label: '3' },
    { id: 8, label: '4' },
    { id: 9, label: '5' }
  ];

  // FIXED: Rating options now use correct IDs from table (10-14)
  ratingOptions = [
    { id: 10, label: 'Very Bad', description: 'No implementation' },
    { id: 11, label: 'Bad', description: 'More than 2 items missing' },
    { id: 12, label: 'Fair', description: '2 items missing' },
    { id: 13, label: 'Good', description: 'Only 1 item missing' },
    { id: 14, label: 'Very Good', description: 'Perfect Implementation' }
  ];

  // Yes/No/NA options use IDs: 4=N/A, 5=Yes, 6=No (unchanged)

  isYesNo(question: any): boolean {
    return (String(question.type_id) === '1' || String(question.type_id) === '3') && question.option_type !== '4';
  }

  isScale(question: any): boolean {
    return String(question.type_id) === '2' && question.option_type !== '4';
  }

  isRating(question: any): boolean {
    return question.option_type === '4' || String(question.type_id) === '4';
  }

  private async _ensureQuestionCardsReady(): Promise<void> {
    if (!this.questionCards) return;
    if (this.questionCards.length) return;
    await new Promise<void>(resolve => {
      const sub = this.questionCards.changes.subscribe(() => {
        sub.unsubscribe();
        setTimeout(() => resolve(), 60);
      });
    });
  }

  private loadQuestionsFromApi() {
    const catIdNum = Number(this.categoryId) || 0;
    const countryIdNum = Number(this.countryId) || 0;

    console.log('Loading daily promoter questions for', { catIdNum, countryIdNum });

    if (!catIdNum || !countryIdNum) {
      console.warn('Missing categoryId or countryId - skipping API call', { catIdNum, countryIdNum });
      this.questions = [];
      this.photos = [];
      return;
    }

    this.apiService.getDailyPromoterQuestions(catIdNum, countryIdNum).subscribe({
      next: (res: any) => {
        console.log('API response (daily_special_promoter_questions):', res);

        const raw = Array.isArray(res) ? res : (res?.data ?? []);

        if (!raw || raw.length === 0) {
          this.questions = [];
          this.photos = [];
          this.alertController.create({
            header: 'No questions',
            message: res?.message ?? 'No questions found for the selected Category / Country.',
            buttons: ['OK']
          }).then(a => a.present());
          return;
        }

 this.questions = raw.map((q: any) => {
  const type_id = String(q.type_id ?? q.q_type ?? '');
  const option_type = String(q.option_type ?? q.q_type ?? '');

  return {
    ...q,
    q_type: q.q_type ?? '',
    type_id,
    option_type,
    // normalize is_na so template checks work (accept '1' or 1 downstream)
    is_na: (q.is_na !== undefined && q.is_na !== null) ? q.is_na : '0',
    selectedOption: q.selectedOption !== undefined ? q.selectedOption : null,
    remarks: q.remarks || '',
    images: q.images || [],
    ratingOptions: q.ratingOptions && q.ratingOptions.length ? q.ratingOptions : this.ratingOptions,
    scaleOptions: q.scaleOptions && q.scaleOptions.length ? q.scaleOptions : this.scaleOptions
  };
}) as ChecklistQuestion[];

        this.photos = this.questions.map(() => []);

        setTimeout(() => {
          const firstUnanswered = this.getUnansweredIndices()[0];
          if (typeof firstUnanswered === 'number') {
            this._ensureQuestionCardsReady().then(() => {
              this.scrollToQuestion(firstUnanswered);
              const unansweredIndices = this.getUnansweredIndices();
              this.unansweredSet = new Set(unansweredIndices);
              this.unansweredCount = unansweredIndices.length;
              if (this.unansweredCount > 0) {
                this.presentUnansweredToast(this.unansweredCount);
              }
            });
          } else {
            this.unansweredSet = new Set();
            this.unansweredCount = 0;
          }
        }, 120);
      },
      error: (err: any) => {
        console.error('Failed to load daily promoter questions', err);
        this.questions = [];
        this.photos = [];
        this.alertController.create({
          header: 'Error',
          message: 'Unable to load questions. Please try again later.',
          buttons: ['OK']
        }).then(a => a.present());
      }
    });
  }

  onOptionChange(question: any, newVal: any) {
    if (typeof newVal === 'string' && /^\d+$/.test(newVal)) {
      question.selectedOption = Number(newVal);
    } else {
      question.selectedOption = newVal === '' ? null : newVal;
    }

    const unansweredIndices = this.getUnansweredIndices();
    this.unansweredSet = new Set(unansweredIndices);
    this.unansweredCount = unansweredIndices.length;

    const cards = this.questionCards?.toArray() || [];
    const qIndex = this.questions.indexOf(question);
    const cardEl = cards[qIndex]?.nativeElement as HTMLElement | undefined;
    if (cardEl && !this.isUnanswered(question)) {
      cardEl.classList.remove('unanswered');
    }

    if (this.hasTriedSubmit) {
      this.presentUnansweredToast(this.unansweredCount);
    }
  }

  private _activeToast: HTMLIonToastElement | null = null;

  private async presentUnansweredToast(count: number) {
    try { if (this._activeToast) await this._activeToast.dismiss(); } catch(e) {}

    const message = count > 0 ? `${count} unanswered remaining` : 'All questions answered';
    const toast = await this.toastController.create({
      message,
      duration: 1600,
      position: 'bottom',
      cssClass: 'unanswered-toast'
    });
    this._activeToast = toast;
    await toast.present();

    setTimeout(() => this._activeToast = null, 1700);
  }

  isUnanswered(question: any): boolean {
    return question.selectedOption === null || question.selectedOption === undefined;
  }

  private getUnansweredIndices(): number[] {
    return this.questions
      .map((q, i) => (q.selectedOption === null || q.selectedOption === undefined) ? i : -1)
      .filter(i => i !== -1);
  }

  private scrollToQuestion(index: number) {
    const cards = this.questionCards?.toArray() || [];
    const el = cards[index]?.nativeElement as HTMLElement | undefined;
    if (!el) return;
    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  private async scrollThroughUnanswered(): Promise<void> {
    this._clearUnansweredTimers();

    const targets = this.getUnansweredIndices();
    if (!targets.length) return;

    await this._ensureQuestionCardsReady();
    const cards = this.questionCards?.toArray() || [];

    targets.forEach((idx, k) => {
      const t = setTimeout(() => {
        const el = cards[idx]?.nativeElement as HTMLElement | undefined;
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
        { text: 'No', role: 'cancel' },
        { text: 'Yes', handler: () => this.submitAnswers() }
      ]
    });
    await confirm.present();
  }

  areAllQuestionsAnswered(): boolean {
    return this.questions.every(q => q.selectedOption !== null && q.selectedOption !== undefined);
  }

  async submitAnswers() {
    const userIdString = localStorage.getItem('userId');
    const userId = userIdString ? Number(userIdString) : null;

    const promoterIdValue = this.promoterId ?? localStorage.getItem('promoterId') ?? String(userId ?? '');
    if (!promoterIdValue) {
      const alert = await this.alertController.create({
        header: 'Missing promoter',
        message: 'Promoter ID is not set. Please open the audit from a promoter context or contact support.',
        buttons: ['OK']
      });
      await alert.present();
      return;
    }

    // FIXED: No more ID mapping needed - using correct IDs from the start
    const normalizedQuestions = this.questions.map((q, index) => {
      let sel: any = q.selectedOption;

      // Convert string numbers to actual numbers
      if (typeof sel === 'string' && /^\d+$/.test(sel)) {
        sel = Number(sel);
      }

      const finalSel = sel === undefined ? null : sel;

      return {
        question_id: q.id,
        sel_option: finalSel, // Now sends correct IDs: 1-9 for scale, 10-14 for rating, 4-6 for yes/no
        remark: q.remarks || '',
        images: (this.photos[index] || []).map(p => p.base64 ?? p),
        promoter_id: promoterIdValue
      };
    });

    const payload: any = {
      store_id: this.storeId,
      user_id: userId,
      promoter_id: promoterIdValue,
      category_id: this.categoryId,
      feedback: this.feedback,
      questions: normalizedQuestions,
      feedback_images: this.feedbackImages.map(f => ({ caption: f.caption, images: f.images }))
    };

    console.log('Submitting payload to checklist_daily_promoter_answer:', payload);

    this.apiService.submitDailyPromoterAnswers(payload).subscribe({
      next: async (res: any) => {
        console.log('submitDailyPromoterAnswers response', res);
        const ok = await this.alertController.create({
          header: 'Success',
          message: 'Submit successfully.',
          buttons: [{ text: 'OK', handler: () => this.router.navigate(['/home']) }]
        });
        await ok.present();
      },
      error: async (err: any) => {
        console.error('Error submitting answers', err);
        const alert = await this.alertController.create({
          header: 'Error',
          message: err?.error?.message ?? 'Failed to submit answers. Please try again.',
          buttons: ['OK']
        });
        await alert.present();
      }
    });
  }

  async openImageInBrowser(url: string) {
    try {
      await Browser.open({ url, toolbarColor: '#000000', presentationStyle: 'fullscreen' });
    } catch (e) {
      console.error('In-app browser error:', e);
    }
  }

  async selectImage(questionIndex: number) {
    const sheet = await this.actionSheetController.create({
      header: 'Select Image Source',
      buttons: [
        { text: 'Camera',  handler: () => this.captureImage(CameraSource.Camera, questionIndex) },
        { text: 'Gallery', handler: () => this.captureImage(CameraSource.Photos, questionIndex) },
        { text: 'Cancel', role: 'cancel' }
      ]
    });
    await sheet.present();
  }

  async captureImage(source: CameraSource, questionIndex: number) {
    try {
      const image = await Camera.getPhoto({
        quality: 60,
        allowEditing: false,
        resultType: CameraResultType.Base64,
        source
      });
      if (!image?.base64String) return;

      const format = image.format || 'jpeg';
      const fileName = `image_${this.questions[questionIndex].id}.${format}`;
      const uniqueFileName = `image_${this.questions[questionIndex].id}_${Date.now()}.${format}`;

      if (!this.photos[questionIndex]) this.photos[questionIndex] = [];
      this.photos[questionIndex].push({
        url: uniqueFileName,
        name: fileName,
        base64: `data:image/${format};base64,${image.base64String}`
      });
    } catch (e) {
      console.error('captureImage error:', e);
    }
  }

  removeQuestionImage(qIdx: number, imgIdx: number) {
    this.photos[qIdx]?.splice(imgIdx, 1);
  }

  addFeedbackSection() {
    this.feedbackImages.push({ caption: '', images: [] });
  }

  async selectFeedbackImage(index: number) {
    const sheet = await this.actionSheetController.create({
      header: 'Select Feedback Image Source',
      buttons: [
        { text: 'Camera',  handler: () => this.captureFeedbackImage(CameraSource.Camera, index) },
        { text: 'Gallery', handler: () => this.captureFeedbackImage(CameraSource.Photos, index) },
        { text: 'Cancel', role: 'cancel' }
      ]
    });
    await sheet.present();
  }

  async captureFeedbackImage(source: CameraSource, idx: number) {
    try {
      const image = await Camera.getPhoto({
        quality: 80,
        allowEditing: false,
        resultType: CameraResultType.Base64,
        source
      });
      if (!image?.base64String) return;
      const base64 = `data:image/jpeg;base64,${image.base64String}`;
      this.feedbackImages[idx].images.push(base64);
    } catch (e) {
      console.error('captureFeedbackImage error:', e);
    }
  }

  removeFeedbackSection(index: number) {
    this.feedbackImages.splice(index, 1);
  }

  removeFeedbackImage(feedbackIndex: number, imgIndex: number) {
    this.feedbackImages[feedbackIndex].images.splice(imgIndex, 1);
  }
}