// import { Component, OnInit } from '@angular/core';
// import { DomSanitizer } from '@angular/platform-browser';
// import { ApiService } from 'src/app/services/api.service';
// import { ActivatedRoute } from '@angular/router';

// @Component({
//   selector: 'app-online-webniar-screen',
//   templateUrl: './online-webniar-screen.page.html',
//   styleUrls: ['./online-webniar-screen.page.scss'],
// })
// export class OnlineWebniarScreenPage implements OnInit {
//   webinarUrl: any;
//   selectedCategory: any;
//   categories: any[] = [];
  
//   // Category options for a selection modal
//   categoryOptions = {
//     header: 'Select Category'
//   };

//   // Parameters from the route
//   eventId!: string;
//   iframeCode!: string;
//   buttonId!: string;

//   constructor(
//     private sanitizer: DomSanitizer,
//     private apiService: ApiService,
//     private route: ActivatedRoute // Inject ActivatedRoute
//   ) {}

//   ngOnInit() {
//     // Retrieve query parameters on initialization
//     this.route.queryParams.subscribe(params => {
//       this.eventId = params['eventId'];
//       this.iframeCode = params['iframeCode'];
//       this.buttonId = params['buttonId'];

//       if (this.iframeCode) {
//         // Sanitize and set the webinar URL
//         this.webinarUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.iframeCode);
//       } else {
//         console.error('No iframe code provided');
//       }
//     });
//   }

//   ionViewDidEnter() {
//     this.fetchAllCategories();
//   }

//   fetchAllCategories() {
//     this.apiService.getAllCategories().subscribe(
//       (response) => {
//         if (response.status) { // Assuming your API response has a status field
//           this.categories = response.data; // Store the fetched categories
//         } else {
//           console.error('Failed to fetch categories:', response.message);
//         }
//       },
//       (error) => {
//         console.error('Error fetching categories:', error);
//       }
//     );
//   }
// }


import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ApiService } from 'src/app/services/api.service';
import { ActivatedRoute } from '@angular/router';
// import { WebinarService } from 'src/app/services/webinar.service'; // Import your WebinarService
import { ToastController } from '@ionic/angular'; // Import ToastController for notifications

@Component({
  selector: 'app-online-webniar-screen',
  templateUrl: './online-webniar-screen.page.html',
  styleUrls: ['./online-webniar-screen.page.scss'],
})
export class OnlineWebniarScreenPage implements OnInit {
  webinarUrl: any;
  selectedCategory: any;
  categories: any[] = [];
  questionText: string = ''; // Variable to hold the question text

  // Category options for a selection modal
  categoryOptions = {
    header: 'Select Product'
  };

  // Parameters from the route
  eventId!: string;
  iframeCode!: string;
  buttonId!: string;

  constructor(
    private sanitizer: DomSanitizer,
    private apiService: ApiService,
    private route: ActivatedRoute,
    private webinarService: ApiService, // Inject WebinarService
    private toastController: ToastController // Inject ToastController
  ) {}

  ngOnInit() {
    // Retrieve query parameters on initialization
    this.route.queryParams.subscribe(params => {
      this.eventId = params['eventId'];
      this.iframeCode = params['iframeCode'];
      this.buttonId = params['buttonId'];

      if (this.iframeCode) {
        // Sanitize and set the webinar URL
        this.webinarUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.iframeCode);
      } else {
        console.error('No iframe code provided');
      }
    });
  }

  ionViewDidEnter() {
    this.count = 0;
     // Retrieve query parameters on initialization
     this.route.queryParams.subscribe(params => {
      this.eventId = params['eventId'];
      this.iframeCode = params['iframeCode'];
      this.buttonId = params['buttonId'];

      if (this.iframeCode) {
        // Sanitize and set the webinar URL
        this.webinarUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.iframeCode);
      } else {
        console.error('No iframe code provided');
      }
    });
    this.fetchAllCategories();
  }

  fetchAllCategories() {
    this.apiService.getAllCategories().subscribe(
      (response) => {
        if (response.status) {
          this.categories = response.data;
        } else {
          console.error('Failed to fetch categories:', response.message);
        }
      },
      (error) => {
        console.error('Error fetching categories:', error);
      }
    );
  }
  count:number = 0;
  async submitQuestion() {
    if (!this.questionText || !this.selectedCategory) {
      const toast = await this.toastController.create({
        message: 'Please enter a question and select a category.',
        duration: 2000,
        color: 'danger'
      });
      await toast.present();
      return;
    }

    const userIdString = localStorage.getItem('userId');
    const userId = userIdString ? Number(userIdString) : null;
    const questionData = {
      userId: userId,
      product_id: this.selectedCategory.id,
      event_id: this.eventId,
      btns_id: this.buttonId,
      question: this.questionText,
      source: 'app'
    };


    console.log(questionData);


    this.webinarService.webinarpostQuestion(questionData).subscribe(
      async (response) => {
        if (response.status) {
          this.count = response.data.TotalQuestionsAskedbyYou; 
          const toast = await this.toastController.create({
            message: response.message,
            duration: 2000,
            color: 'success'
          });
          await toast.present();
          this.questionText = ''; // Clear the textarea after submission
        } else {
          const toast = await this.toastController.create({
            message: response.message || 'Failed to post question.',
            duration: 2000,
            color: 'danger'
          });
          await toast.present();
        }
      },
      async (error) => {
        const toast = await this.toastController.create({
          message: 'An error occurred while posting your question.',
          duration: 2000,
          color: 'danger'
        });
        await toast.present();
        console.error('Error posting question:', error);
      }
    );
  }
}