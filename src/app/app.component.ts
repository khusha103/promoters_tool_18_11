import { Component, Renderer2, Inject, AfterViewInit } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { NavigationEnd, Router } from '@angular/router';
import { AlertController, ModalController, Platform } from '@ionic/angular';
import { register } from 'swiper/element/bundle';
import { StatusBar, Style } from '@capacitor/status-bar';
import { App } from '@capacitor/app'; // Ensure this import is correct
import { NetworkService } from './services/network.service';
import { Location } from '@angular/common';
import { FcmService } from './services/fcm.service';
import { ApiService } from './services/api.service';
import { CountryModalComponent } from './components/country-modal/country-modal.component';
import { AuthService } from './services/auth.service';

register();


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  // constructor(
  //   private platform: Platform,
  //   private alertController: AlertController,
  //   private router: Router,
  //   private networkService: NetworkService,
  //   private location: Location,
  //   private fcmService: FcmService,
  //   private modalController: ModalController,
  //   private apiService: ApiService,
  //   private authservice:AuthService,
  //   private renderer: Renderer2,
  //   @Inject(DOCUMENT) private document: Document
  // ) {
  //   // this.checkAppSelection();
  //   this.router.events.subscribe((event) => {
  //     if (event instanceof NavigationEnd) {
  //       // Ensure checkAppSelection is not called for the splash screen (root "/")
  //       if (event.url !== '/' && event.url !== '/pta-login' && event.url !== '/terms-and-conditions' && event.url !== '/no-internet' ) {
  //         //will add splash
  //         this.checkAppSelection();
  //       }
  //       // this.checkAppSelection();
  //     }
  //   });
  //   this.subscribeToFCMToken();
  //   this.initializeApp(); // Call the initializeApp method
  //   this.customBackNavigation(); // Initialize custom back navigation
  // }

  constructor(
  private platform: Platform,
  private alertController: AlertController,
  private router: Router,
  private networkService: NetworkService,
  private location: Location,
  private fcmService: FcmService,
  private modalController: ModalController,
  private apiService: ApiService,
  private authservice: AuthService,
  private renderer: Renderer2,
  @Inject(DOCUMENT) private document: Document
) {
  // 🔐 Redirect if already logged in and trying to go to login page
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  const userId = localStorage.getItem('userId');
  const currentUrl = this.router.url;

  if (isLoggedIn && userId && (currentUrl === '/pta-login' || currentUrl === '/')) {
    this.router.navigateByUrl('/home'); // Change to your post-login route if needed
  }

  // 🔁 Router event handler
  this.router.events.subscribe((event) => {
    if (event instanceof NavigationEnd) {
      if (
        event.url !== '/' &&
        event.url !== '/pta-login' &&
        event.url !== '/terms-and-conditions' &&
        event.url !== '/no-internet'
      ) {
        this.checkAppSelection();
      }
    }
  });

  this.subscribeToFCMToken();
  this.initializeApp(); // App setup
  this.customBackNavigation(); // Custom back button behavior
}

  ngAfterViewInit() {
    this.setBodyClassBasedOnColorScheme();
  }
  
    roleId: string | null = null;
    lang: string | null = null;
    cid: string | null = null;
    userRole:string | null = null;
    // errorMessage: string | null = null;
    getUserRole() {
      const UserId = localStorage.getItem('userId');
      if (UserId) {
        this.authservice.getUserRole(UserId).subscribe({
          next: (response) => {
            if (response.status) {
              this.roleId = response.data.role_id; 
              this.userRole = response.data.role_id; 
              console.log(this.roleId);
              this.cid=response.data.region_id;
              console.log(this.cid);
              if(this.cid){
                localStorage.setItem('cnt_wip', this.cid);
              }

              this.lang =response.data.user_lang;
              //when get roleid then call methods
              // this.intializeapp();
            } else {
              // this.errorMessage = response.message; // Handle error message
            }
          },
          error: (error) => {
            console.error('API Error:', error);
            // this.errorMessage = 'Failed to retrieve user role. Please try again later.';
          }
        });
      }
    }
  
  checkAppSelection() {
    const appSelection = localStorage.getItem('app_selection');

    if (appSelection === '2' || appSelection === '1') {
      this.getUserRole(); //this will set cnt id in loca storage
      // this.checkCountrySelection();
    }
  }
  setBodyClassBasedOnColorScheme() {
    const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const applyClass = (isDark: boolean) => {
      const body = this.document.body;
      this.renderer.removeClass(body, 'dark_pta');
      this.renderer.removeClass(body, 'light_pta');
      this.renderer.addClass(body, isDark ? 'dark_pta' : 'light_pta');
    };

    // Initial set
    applyClass(darkModeMediaQuery.matches);

    // Listen to changes
    darkModeMediaQuery.addEventListener('change', (e) => {
      applyClass(e.matches);
    });
  }

  fcmToken: string | null = null;

  private subscribeToFCMToken() {
    // Subscribe to the FCM token observable
    this.fcmService.token$.subscribe(token => {
      this.fcmToken = token;
      // console.log('FCM Token in AppComponent:', this.fcmToken);
      // Save token to backend or local storage as needed
    });
  }


  async checkCountrySelection() {
    // Fetch stored country ID from localStorage
    const storedCountryId = localStorage.getItem('cnt_wip');

    // if (!storedCountryId) {
    //   // If no country is stored, show the modal immediately
    //   this.openCountryModal();
    //   return;
    // }

    //will get user first region id and set in cnt_wip variable 


    if (!storedCountryId) {
      // If no country is stored, show the modal with a 2-second delay
      setTimeout(() => {
          this.openCountryModal();
      }, 1000);
      return;
  }
    const userID = localStorage.getItem('userId');
    if(userID){
    // Call API to fetch multi-region IDs
    this.apiService.getMultiRegionIds(userID).subscribe(
      (response) => {
        if (response?.status && response.multi_region_id) {
          // Convert multi_region_id string to an array
          const allowedRegions = response.multi_region_id.split(',');

          // Check if storedCountryId is in allowedRegions
          if (allowedRegions.includes(storedCountryId)) {
            console.log('Country exists in the list, no action needed.');
          } else {
          
            console.log('Country NOT in list, resetting selection.');
            localStorage.removeItem('cnt_wip');
            this.openCountryModal();
          }
        }
      },
      (error) => {
        console.error('Error fetching API:', error);
        this.openCountryModal(); // Show modal in case of API error
      }
    );
  }
  }

  async openCountryModal() {
    const modal = await this.modalController.create({
      component: CountryModalComponent,
      cssClass: 'small-modal', // Custom class for styling
      backdropDismiss: false, // Prevent closing without selection
    });

    await modal.present();

    const { data } = await modal.onWillDismiss();
    if (data) {
      localStorage.setItem('cnt_wip', data);
      console.log('New country selected:', data);
    }
  }

  // initializeApp() {
  //   this.platform.ready().then(() => {
  //     // Set the status bar to dark mode
  //     StatusBar.setStyle({ style: Style.Dark });
  //     // Set the background color of the status bar
  //     StatusBar.setBackgroundColor({ color: '#000000' });
      
  //     document.body.classList.remove('dark');

  //   });
  // }

  initializeApp() {
    this.platform.ready().then(async () => {
      // Set the status bar to dark mode
      await StatusBar.setStyle({ style: Style.Dark });
      
      // Set the status bar to overlay the web view
      // await StatusBar.setOverlaysWebView({ overlay: true });
      
      // Set the background color of the status bar
      await StatusBar.setBackgroundColor({ color: '#000000' });
      
      document.body.classList.remove('dark');
    });
  }

  customBackNavigation() {
    this.platform.ready().then(() => {
      // Register back button action globally
      this.platform.backButton.subscribeWithPriority(10, () => {
        if (this.isOnHomePage()) {
          // Show exit confirmation if on home page
          this.showExitConfirmation();
        } else if (this.isOnLoginPage()) {
          // Show exit confirmation if on login page
          this.showExitConfirmationLogin();
        } 
        else if (this.isOnNointernetPage()) {
          // Show exit confirmation if on login page
          this.showExitConfirmation();
        }
        else if (this.isOnUpdateRangingFeedbackPage()) {
          // Show exit confirmation if on login page
          this.showExitConfirmation_updateRanging();
        } 
        else if (this.isOnExamQuesPage()) {
          // Show exit confirmation if on login page
          this.showExitExam();
        }
        else if (this.isOnExamResultPage()) {
          // Show exit confirmation if on login page
          this.showExitConfirmation();
        } 
        else if (this.isOnVmdQuesPage()) {
          // Show exit confirmation if on login page
          this.showExitConfirmationQues();
        }
        else if (this.isOnPromoterQuesPage()) {
          // Show exit confirmation if on login page
          this.showExitConfirmationQues();
        }
        // else if (this.isOnPlanogramSlidesFeedbackPage()) {
        //   // Show exit confirmation if on login page
        //   this.showPlanogramSlidesBack();
        // }
        else if (this.isOnImageFeedbackPage()) {
          // Show exit confirmation if on login page
          this.showExitConfirmationImageFeedback();
        }else {
          // Navigate back in history
          this.location.back(); // Go back one level in history
        }
      });
    });
  }

  private isOnHomePage(): boolean {
    return this.router.url === '/home'; 
  }


  private isOnNointernetPage(): boolean {
    return this.router.url === '/no-internet'; 
  }

  private isOnLoginPage(): boolean {
    return this.router.url === '/pta-login'; 
  }

  private isOnPlanogramSlidesFeedbackPage(): boolean {
    const currentUrl = this.router.url; 
    const targetPath = '/planogram-area'; 
    return currentUrl.startsWith(targetPath); 
  }

  private isOnUpdateRangingFeedbackPage(): boolean {
    const currentUrl = this.router.url; 
    const targetPath = '/update-ranging-feedback'; 
    return currentUrl.startsWith(targetPath); 
  }

  private isOnVmdQuesPage(): boolean {
    const currentUrl = this.router.url; 
    const targetPath = '/daily-vmdchecklist-ques'; 
    return currentUrl.startsWith(targetPath); 
}

  private isOnPromoterQuesPage(): boolean {
    const currentUrl = this.router.url; 
    const targetPath = '/promoters-assessment-ques'; 
    return currentUrl.startsWith(targetPath); 
}

private isOnImageFeedbackPage(): boolean {
  const currentUrl = this.router.url; 
  const targetPath = '/daily-vmdchecklist-feedphoto'; 
  return currentUrl.startsWith(targetPath); 
}

private isOnExamQuesPage(): boolean {
  const currentUrl = this.router.url; 
  const targetPath = '/online-exam-ques'; 
  return currentUrl.startsWith(targetPath); 
}


private isOnExamResultPage(): boolean {
  const currentUrl = this.router.url; 
  const targetPath = '/online-exam-result'; 
  return currentUrl.startsWith(targetPath); 
}

private async showPlanogramSlidesBack() {
  const alert = await this.alertController.create({
    header: 'Please use the header back button',
    message: 'To navigate back, please use the back button in the header of the page.',
    buttons: [
      {
        text: 'Okay',
        role: 'cancel'
      }
    ]
  });
  await alert.present();
}

  private async showExitConfirmation() {
    const alert = await this.alertController.create({
      header: 'Confirm Exit',
      message: 'Are you sure you want to exit?',
      buttons: [
        {
          text: 'Stay',
          role: 'cancel',
          handler: () => {
            console.log('Application exit prevented!');
          },
        },
        {
          text: 'Exit',
          handler: () => {
            App.exitApp(); // Close app using Capacitor's App plugin
          },
        },
      ],
    });
    await alert.present();
  }

  private async showExitExam() {
    const alert = await this.alertController.create({
      header: 'Confirm Back',
      message: 'Do you want to leave the exam page? Please note that you will lose any unsaved changes.',
      buttons: [
        {
          text: 'Stay',
          role: 'cancel',
          handler: () => {
            console.log('Application back prevented!');
          },
        },
        {
          text: 'Back',
          handler: () => {
            // App.exitApp(); 
            // this.location.back();
            // this.router.navigate(['/online-exam-category']);
            this.router.navigate(['/home']);
          },
        },
      ],
    });
    await alert.present();
  }

  private async showExitConfirmationImageFeedback() {
    const alert = await this.alertController.create({
        header: 'Confirm Exit',
        message: 'You have unsaved changes for feedback image. Are you sure you want to exit without saving?',
        buttons: [
            {
                text: 'Stay',
                role: 'cancel',
                handler: () => {
                    console.log('Application exit prevented!');
                },
            },
            {
                text: 'Exit',
                handler: () => {
                    App.exitApp(); // Close app using Capacitor's App plugin
                },
            },
        ],
    });
    await alert.present();
}


private async showExitConfirmation_updateRanging() {
  const alert = await this.alertController.create({
      header: 'Unsaved Changes',
      message: 'You didn’t submit your feedback. Are you sure you want to navigate away?',
      buttons: [
          {
              text: 'Cancel',
              role: 'cancel',
              handler: () => {
                  console.log('Application exit prevented!');
              },
          },
          {
              text: 'Proceed',
              handler: () => {
                  // App.exitApp(); // Close app using Capacitor's App plugin
                  this.location.back();
              },
          },
      ],
  });
  await alert.present();
}

  private async showExitConfirmationQues() {
    const message = 'You have unsaved changes in the questionnaire. Are you sure you want to back?';

    const alert = await this.alertController.create({
        header: 'Confirm Exit Screen',
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
                    this.location.back();
                },
            },
        ],
    });
    
    await alert.present();
}


  private async showExitConfirmationLogin() {
    const alert = await this.alertController.create({
      header: 'Confirm Exit',
      message: 'Are you sure you want to exit from the login page?',
      buttons: [
        {
          text: 'Stay',
          role: 'cancel',
          handler: () => {
            console.log('Application exit prevented!');
          },
        },
        {
          text: 'Exit',
          handler: () => {
            App.exitApp(); // Close app using Capacitor's App plugin
          },
        },
      ],
    });
    await alert.present();
  }
}


// import { Component } from '@angular/core';
// import { Router } from '@angular/router';
// import { AlertController, Platform } from '@ionic/angular';
// import { register } from 'swiper/element/bundle';
// import { StatusBar, Style } from '@capacitor/status-bar';
// import { App } from '@capacitor/app';
// import { NetworkService } from './services/network.service';
// import { Location } from '@angular/common';
// import { FcmService } from './services/fcm.service';

// register();

// @Component({
//   selector: 'app-root',
//   templateUrl: 'app.component.html',
//   styleUrls: ['app.component.scss'],
// })
// export class AppComponent {
//   fcmToken: string | null = null;

//   constructor(
//     private platform: Platform,
//     private alertController: AlertController,
//     private router: Router,
//     private networkService: NetworkService,
//     private location: Location,
//     private fcmService: FcmService
//   ) {
//     this.subscribeToFCMToken();
//     this.initializeApp();
//     this.customBackNavigation();
//   }

//   private subscribeToFCMToken() {
//     this.fcmService.token$.subscribe(token => {
//       this.fcmToken = token;
//     });
//   }

//   private async initializeApp() {
//     await this.platform.ready();
//     await StatusBar.setStyle({ style: Style.Dark });
//     await StatusBar.setBackgroundColor({ color: '#000000' });
//     document.body.classList.remove('dark');
//   }

//   // private setupBackNavigation() {
//   //   this.platform.ready().then(() => {
//   //     this.platform.backButton.subscribeWithPriority(10, () => {
//   //       const backAction = this.getBackNavigationAction();
//   //       if (backAction) {
//   //         backAction();
//   //       } else {
//   //         this.location.back();
//   //       }
//   //     });
//   //   });
//   // }

//   // private getBackNavigationAction(): (() => void) | null {
//   //   const routeActions: { [key: string]: () => Promise<void> } = {
//   //     '/home': () => this.showExitConfirmation(),
//   //     '/no-internet': () => this.showExitConfirmation(),
//   //     '/pta-login': () => this.showExitConfirmationLogin(),
//   //     '/online-exam-ques': () => this.showExitExam(),
//   //     '/online-exam-result': () => this.showExitConfirmation(),
//   //     '/daily-vmdchecklist-feedphoto': () => this.showExitConfirmationImageFeedback(),
//   //     '/update-ranging-feedback': () => this.showExitConfirmationUpdateRanging(),
//   //   };

//   //   // Check exact matches
//   //   if (routeActions[this.router.url]) {
//   //     return routeActions[this.router.url];
//   //   }

//   //   // Check prefix-based matches
//   //   const prefixActions: { prefix: string; action: () => Promise<void> }[] = [
//   //     { prefix: '/planogram-area', action: () => this.showPlanogramSlidesBack() },
//   //     { prefix: '/daily-vmdchecklist-ques', action: () => this.showExitConfirmationQues() },
//   //     { prefix: '/promoters-assessment-ques', action: () => this.showExitConfirmationQues() },
//   //   ];

//   //   for (const { prefix, action } of prefixActions) {
//   //     if (this.router.url.startsWith(prefix)) {
//   //       return action;
//   //     }
//   //   }

//   //   return null;
//   // }

//   customBackNavigation() {
//     this.platform.ready().then(() => {
//       this.platform.backButton.subscribeWithPriority(10, () => {
//         const action = this.getBackNavigationAction();
//         if (action) {
//           action();
//         } else {
//           this.location.back(); // Default back navigation
//         }
//       });
//     });
//   }
  
//   private getBackNavigationAction(): (() => void) | null {
//     let currentPath = this.router.url;
  
//     // Extract base path if query parameters exist
//     if (currentPath.includes('?')) {
//       currentPath = currentPath.split('?')[0];
//     }
  
//     const routeActions: { [key: string]: () => void } = {
//       '/home': () => this.showExitConfirmation(),
//       '/no-internet': () => this.showExitConfirmation(),
//       '/pta-login': () => this.showExitConfirmationLogin(),
//       '/online-exam-ques': () => this.showExitExam(),
//       '/online-exam-result': () => this.showExitConfirmation(),
//       '/daily-vmdchecklist-feedphoto': () => this.showExitConfirmationImageFeedback(),
//       '/update-ranging-feedback': () => this.showExitConfirmationUpdateRanging(),
//     };
  
//     if (routeActions[currentPath]) {
//       return routeActions[currentPath];
//     }
  
//     // For pages that require `startsWith`
//     const prefixActions: { prefix: string; action: () => void }[] = [
//       { prefix: '/planogram-area', action: () => this.showExitConfirmationQues() },
//       { prefix: '/daily-vmdchecklist-ques', action: () => this.showExitConfirmationQues() },
//       { prefix: '/promoters-assessment-ques', action: () => this.showExitConfirmationQues() },
//     ];
  
//     for (const { prefix, action } of prefixActions) {
//       if (this.router.url.startsWith(prefix)) {
//         return action;
//       }
//     }
  
//     return null;
//   }
  
  

//   private async showExitConfirmation() {
//     await this.presentAlert('Confirm Exit', 'Are you sure you want to exit?', 'Exit', () => App.exitApp());
//   }

//   private async showExitExam() {
//     await this.presentAlert(
//       'Confirm Back',
//       'Do you want to leave the exam page? Any unsaved changes will be lost.',
//       'Back',
//       () => this.router.navigate(['/home'])
//     );
//   }

//   private async showExitConfirmationImageFeedback() {
//     await this.presentAlert(
//       'Confirm Exit',
//       'You have unsaved feedback images. Are you sure you want to exit without saving?',
//       'Exit',
//       () => App.exitApp()
//     );
//   }

//   private async showExitConfirmationUpdateRanging() {
//     await this.presentAlert(
//       'Unsaved Changes',
//       'You didn’t submit your feedback. Are you sure you want to navigate away?',
//       'Proceed',
//       () => this.location.back()
//     );
//   }

//   private async showExitConfirmationQues() {
//     await this.presentAlert(
//       'Confirm Exit Screen',
//       'You have unsaved changes in the questionnaire. Are you sure you want to go back?',
//       'Back',
//       () => this.location.back()
//     );
//   }

//   private async showPlanogramSlidesBack() {
//     await this.alertController.create({
//       header: 'Navigation Notice',
//       message: 'Please use the header back button to navigate back.',
//       buttons: [{ text: 'Okay', role: 'cancel' }],
//     }).then(alert => alert.present());
//   }

//   private async showExitConfirmationLogin() {
//     await this.presentAlert('Confirm Exit', 'Are you sure you want to exit from the login page?', 'Exit', () => App.exitApp());
//   }

//   private async presentAlert(header: string, message: string, confirmText: string, confirmHandler: () => void) {
//     const alert = await this.alertController.create({
//       header,
//       message,
//       buttons: [
//         { text: 'Stay', role: 'cancel' },
//         { text: confirmText, handler: confirmHandler },
//       ],
//     });
//     await alert.present();
//   }
// }
