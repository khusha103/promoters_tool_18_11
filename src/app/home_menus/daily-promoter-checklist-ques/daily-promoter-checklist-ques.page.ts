import { Component, OnInit, ElementRef, QueryList, ViewChildren } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ActionSheetController, AlertController } from '@ionic/angular';
import { Browser } from '@capacitor/browser';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

// FRONTEND-ONLY: no API calls yet; plug your service later
import { ApiService } from 'src/app/services/api.service';
// import { environment } from 'src/environments/environment';

interface ChecklistQuestion {
  option_type: any;
  type_id: any;
  scaleOptions: any;
  ratingOptions: any;
  id: number;
  body: string;
  file_name?: string;     // optional server image (unused for now)
  is_na?: '0' | '1';
  selectedOption: number | null;  // 5=yes, 6=no, 4=na
  remarks: string;
}

@Component({
  selector: 'app-daily-promoter-checklist-ques',
  templateUrl: './daily-promoter-checklist-ques.page.html',
  styleUrls: ['./daily-promoter-checklist-ques.page.scss'],
})
export class DailyPromoterChecklistQuesPage implements OnInit {

  // ===== route/query params (kept compatible) =====
  categoryId!: string;
  countryId!: string;
  storeId!: string;
  promoterId!: string | null; // <- added
  hasTriedSubmit = false;
  unansweredCount = 0;

  // ===== data =====
  questions: ChecklistQuestion[] = [];
  photos: { url: string; name: string; base64: string }[][] = [];
  feedback: string = '';
  feedbackImages: { caption: string; images: string[] }[] = [];
baseUrl: any;
  // catId: any;
  trackByQuestion(index: number, item: ChecklistQuestion) {
    return item?.id ?? index;
  }

  // ===== UI helpers =====
  @ViewChildren('questionCard') questionCards!: QueryList<ElementRef>;
  unansweredSet: Set<number> = new Set<number>();

  // baseUrl = `${environment.baseUrl}/sony-erp/uploads/`; // for later, if needed

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private alertController: AlertController,
    private actionSheetController: ActionSheetController,
    private apiService: ApiService
  ) {}

  ngOnInit() {
    // read params if provided
    this.route.queryParams.subscribe(params => {
      this.categoryId = params['categoryId'];
      this.countryId  = params['countryId'];
      this.storeId    = params['storeId'];

      // promoterId first from route query, fallback to localStorage('promoterId') or localStorage('userId')
      this.promoterId = params['promoterId'] ?? localStorage.getItem('promoterId') ?? localStorage.getItem('userId') ?? null;

      console.log('Init params:', { categoryId: this.categoryId, countryId: this.countryId, storeId: this.storeId, promoterId: this.promoterId });

      this.loadQuestionsFromApi();
    });

    // FRONTEND-ONLY: load mock questions (replace with API later)
    // this.loadQuestionsMock();
  }

  // ---------- FRONTEND MOCK ----------
  // private loadQuestionsMock() {
  //   // mimic your existing structure
  //   const sample: ChecklistQuestion[] = [
  //     { id: 1, body: 'Is the counter cleaned before opening?', is_na: '0', selectedOption: null, remarks: '' },
  //     { id: 2, body: 'POP materials placed correctly?',      is_na: '1', selectedOption: null, remarks: '' },
  //     { id: 3, body: 'Demo devices powered and updated?',    is_na: '0', selectedOption: null, remarks: '' },
  //   ];
  //   this.questions = sample;
  // }

  private loadQuestionsFromApi() {
    const catIdNum = Number(this.categoryId) || 0;
    const countryIdNum = Number(this.countryId) || 0;

    console.log('Loading daily promoter questions for', { catIdNum, countryIdNum });

    // Do not call API if IDs are missing
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

    this.questions = raw.map((q: any) =>  {
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
          { id: 4, label: '4' },
          { id: 5, label: '5' }
        ];

        // Build final question object used by template
        return {
          ...q,
          q_type: q.q_type,
           type_id: Number(q.type_id), 
          option_type,
          selectedOption,
          remarks: q.remarks || '',
          images: q.images || [],
          ratingOptions: q.ratingOptions || ratingOptions,
          scaleOptions: q.scaleOptions || scaleOptions
        };
      }) as ChecklistQuestion[];

        this.photos = this.questions.map(() => []);
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

  // Replace with real API later:
  // private loadQuestionsFromApi() {
  //   this.apiService.getDailyPromoterChecklistQuestions(this.categoryId, this.countryId).subscribe(...)
  // }

  // ---------- validation / flow ----------
  private getUnansweredIndices(): number[] {
    return this.questions
      .map((q, i) => (q.selectedOption === null || q.selectedOption === undefined) ? i : -1)
      .filter(i => i !== -1);
  }

  private scrollToQuestion(index: number) {
    const el = this.questionCards?.toArray()[index]?.nativeElement;
    el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  private scrollThroughUnanswered(): void {
    const targets = this.getUnansweredIndices();
    if (!targets.length) return;

    const cards = this.questionCards?.toArray() || [];

    targets.forEach((idx, k) => {
      setTimeout(() => {
        const el = cards[idx]?.nativeElement as HTMLElement;
        if (!el) return;

        el.scrollIntoView({ behavior: 'smooth', block: 'start' });

        // pulse highlight briefly
        el.classList.add('pulse');
        setTimeout(() => el.classList.remove('pulse'), 1200);

        // persist final unanswered highlight on the last item
        if (k === targets.length - 1) {
          el.classList.add('unanswered');
        }
      }, k * 900); // 900ms gap between each scroll
    });
  }


  async onSubmitClick() {
    // mark attempt and compute missing
    this.hasTriedSubmit = true;
    const unanswered = this.getUnansweredIndices();
    this.unansweredSet = new Set(unanswered);
    this.unansweredCount = unanswered.length;

    // If any unanswered -> show banner + sequential scroll; do NOT open confirm dialog
    if (unanswered.length > 0) {
      // show sequential scroll + pulses
      this.scrollThroughUnanswered();
      return;
    }

    // All answered -> confirm then submit
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


  // images optional, feedback optional
  areAllQuestionsAnswered(): boolean {
    return this.questions.every(q => q.selectedOption !== null && q.selectedOption !== undefined);
  }

  // ---------- submit (frontend only) ----------
  async submitAnswers() {
    const userIdString = localStorage.getItem('userId');
    const userId = userIdString ? Number(userIdString) : null;

    // Ensure promoterId is available (route, localStorage, or fallback to userId)
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

    // Normalize/validate questions
    const normalizedQuestions = this.questions.map((q, index) => {
      let sel: any = q.selectedOption;

      // convert numeric strings to numbers
      if (typeof sel === 'string' && /^\d+$/.test(sel)) sel = Number(sel);

      // If rating options use ids 10..14 in UI but backend expects 1..5 map them
      if ((q.option_type === '4' || q.type_id === '4') && typeof sel === 'number' && sel >= 10 && sel <= 14) {
        sel = sel - 9; // 10->1 ... 14->5
      }

      // final safe value (null if not set)
      const finalSel = sel === undefined ? null : sel;

      return {
        question_id: q.id,
        sel_option: finalSel,
        remark: q.remarks || '',
        images: (this.photos[index] || []).map(p => p.base64 ?? p),
        promoter_id: promoterIdValue // include per-question if backend expects it
      };
    });

    const payload: any = {
      store_id: this.storeId,
      user_id: userId,
      promoter_id: promoterIdValue,      // <<--- required by backend
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


  // ---------- media helpers ----------
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
