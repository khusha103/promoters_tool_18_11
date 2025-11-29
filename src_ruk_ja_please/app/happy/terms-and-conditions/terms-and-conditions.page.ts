

// terms-and-conditions.page.ts
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';
import { Browser } from '@capacitor/browser';
import { ToastController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-terms-and-conditions',
  templateUrl: './terms-and-conditions.page.html',
  styleUrls: ['./terms-and-conditions.page.scss'],
})
export class TermsAndConditionsPage {

              constructor(private apiService: ApiService,
              private router: Router, 
              private toastController: ToastController,
              private iab: InAppBrowser) {}

              termsAccepted = false; // This should be set based on your form/input
              appVersion = environment.appVersion; // Accessing the app version

            
              async acceptTerms() {
                if (!this.termsAccepted) {
                  await this.showToast('Please accept the terms to continue', 'warning');
                  return;
                }
            
                try {
                  const userIdString = localStorage.getItem('userId'); 
                  const userId = userIdString ? Number(userIdString) : null; 
            
                  if (userId === null) {
                    await this.showToast('User ID not found. Please log in again.', 'danger');
                    return;
                  }
            
                  // Call the API to update terms status and app version
                  const response = await this.apiService.updateTermsAndVersion(userId, 1, this.appVersion).toPromise();
            
                  // Set Terms and Conditions acceptance in local storage
                  // localStorage.setItem('termsAccepted', 'true');
                  
                  // Show success toast
                  await this.showToast('Terms and Conditions accepted successfully', 'success');
                  
                  // Navigate to home page
                  await this.router.navigate(['/home']);
                } catch (error) {
                  console.error('Error accepting terms:', error);
                  await this.showToast('An error occurred. Please try again.', 'danger');
                }
              }
            
              async showToast(message: string, type: string) {
                const toast = await this.toastController.create({
                  message: message,
                  duration: 2000,
                  color: type, // Use the type for color (success, warning, danger)
                  position: 'bottom', // Position of the toast (top, middle, bottom)
                });
                await toast.present();
              }
              
  // openTerms() {
  //   const browser = this.iab.create(
  //     'https://www.sony-mea.com/microsite/termsofuse/en',
  //     '_blank',
  //     {
  //       location: 'yes',
  //       hidden: 'no',
  //       hardwareback: 'yes',
  //       fullscreen: 'no',
  //       clearcache: 'yes',
  //       clearsessioncache: 'yes'
  //     }
  //   );

  //   browser.on('loadstart').subscribe(event => {
  //     console.log('Started loading:', event);
  //   });

  //   browser.on('exit').subscribe(() => {
  //     console.log('Browser closed');
  //   });
  // }

  
  async openTerms() {
    await Browser.open({
      url: 'https://www.sony-mea.com/microsite/termsofuse/en',
      windowName: '_blank', // Works for web
      presentationStyle: 'popover', // For iOS
    });
  
    console.log('Browser opened');
  
    // Optionally, you can listen for browser events like close
    Browser.addListener('browserFinished', () => {
      console.log('Browser closed');
    });
  }
}
