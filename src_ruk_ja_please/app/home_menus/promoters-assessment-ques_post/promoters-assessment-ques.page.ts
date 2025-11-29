import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';
import { environment } from 'src/environments/environment';

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

  questions: any[] = []; // To store the fetched questions
  errorMessage: string | undefined;
  baseUrl: string = `${environment.baseUrl}/sony-erp/uploads/`;


  constructor(private route: ActivatedRoute,private apiService:ApiService,private router: Router,private alertController: AlertController) {}

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
      questions: this.questions.map(question => ({
        id: question.id,
        sel_option: question.selectedOption,
        remark: question.remarks || null // Use null if no remark is provided
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

  // async presentAlert() {
  //   const alert = await this.alertController.create({
  //     header: 'Success',
  //     message: 'Your answers have been submitted successfully.',
  //     buttons: [{
  //       text: 'OK',
  //       handler: () => {
  //         this.feedphoto(); // Call feedphoto function on OK button click
  //       }
  //     }]
  //   });

  //   await alert.present();
  // }


  async presentAlert() {
    const alert = await this.alertController.create({
        header: 'Success',
        message: 'Do you want to submit feedback?',
        buttons: [
            {
                text: 'No',
                handler: () => {
                    this.router.navigate(['/home']); // Redirect to home page
                }
            },
            {
                text: 'Yes',
                handler: () => {
                    this.feedphoto(); // Call feedphoto function on Yes button click
                }
            }
        ]
    });

    await alert.present();
}

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

}
