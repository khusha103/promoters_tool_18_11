import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent implements OnInit {
  appSelection: number | undefined;

  constructor(private router: Router, private alertController: AlertController) { }

  ngOnInit() {
    const storedValue = localStorage.getItem('app_selection');
    
    // Check if storedValue is not null and is either '1' or '2'
    if (storedValue === '1' || storedValue === '2') {
      this.appSelection = +storedValue; // Convert to number
    } else {
      this.appSelection = 0; // Default to 1 if not valid
    }
  }

  async logout() {
    const alert = await this.alertController.create({
      header: 'Confirm Logout',
      message: 'Are you sure you want to logout?',
      cssClass: 'alertCustom',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Logout canceled');
          }
        },
        {
          text: 'Logout',
          handler: () => {
            localStorage.clear();
            this.router.navigate(['/pta-login']);
            // this.router.navigate(['/app-selector']);
          }
        }
      ]
    });

    await alert.present();
  }


  // private async confirmNavigationForPlanogram(targetRoute: string): Promise<void> {
  //   if (this.router.url.includes('/update-ranging-feedback') || this.router.url.includes('/planogram-area') || this.router.url.includes('/planogram-feedback-form')) {
  //     const alert = await this.alertController.create({
  //       header: 'Unsaved Changes',
  //       message: 'You didn’t submit your feedback. Are you sure you want to navigate away?',
  //       buttons: [
  //         {
  //           text: 'Cancel',
  //           role: 'cancel',
  //           handler: () => {
  //             console.log('Navigation canceled');
  //           },
  //         },
  //         {
  //           text: 'Proceed',
  //           handler: () => {
              
  //             this.router.navigate([targetRoute]);
  //           },
  //         },
  //       ],
  //     });
  //     await alert.present();
  //   } else {
  //     // Navigate directly if not on the specified page
  //     this.router.navigate([targetRoute]);
  //   }
  // }

  private async confirmNavigationForPlanogram(targetRoute: string): Promise<void> {
    let message = 'Are you sure you want to navigate away?'; // Default message
  
    if (this.router.url.includes('/update-ranging-feedback')) {
      message = 'You didn’t submit your feedback. Are you sure you want to navigate away?';
    } else if (this.router.url.includes('/planogram-area')) {
      message = 'Your changes in the Planogram Area are not saved. Do you still want to leave?';
    } else if (this.router.url.includes('/planogram-feedback-form')) {
      message = 'You have unsaved feedback. Are you sure you want to exit?';
    } else if (this.router.url.includes('/daily-vmdchecklist-ques')) {
      message = 'You have unsaved changes in the questionnaire. Are you sure you want to back?';
    }else if (this.router.url.includes('/promoters-assessment-ques')) {
      message = 'You have unsaved changes in the questionnaire. Are you sure you want to back?';
    }
  
    // Show alert if the user is on any of these pages
    if (
      this.router.url.includes('/update-ranging-feedback') ||
      this.router.url.includes('/planogram-area') ||
      this.router.url.includes('/planogram-feedback-form') ||
      this.router.url.includes('/daily-vmdchecklist-ques') ||
      this.router.url.includes('/promoters-assessment-ques') 
    ) {
      const alert = await this.alertController.create({
        header: 'Unsaved Changes',
        message: message,
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            handler: () => {
              console.log('Navigation canceled');
            },
          },
          {
            text: 'Proceed',
            handler: () => {
              this.router.navigate([targetRoute]);
            },
          },
        ],
      });
  
      await alert.present();
    } else {
      // Navigate directly if not on the specified pages
      this.router.navigate([targetRoute]);
    }
  }
  

  profile() {
    this.confirmNavigationForPlanogram('/profile');
  }

  settings() {
    this.confirmNavigationForPlanogram('/settings');
  }

  Notifications() {
    this.confirmNavigationForPlanogram('/notifications');
  }

  home() {
    this.confirmNavigationForPlanogram('/home');
  }

  // profile() {
  //   this.router.navigate(['/profile']);
  // }

  // settings() {
  //   this.router.navigate(['/settings']);
  // }

  // Notifications() {
  //   this.router.navigate(['/notifications']);
  // }

  // home() {
  //   this.router.navigate(['/home']);
  // }
}