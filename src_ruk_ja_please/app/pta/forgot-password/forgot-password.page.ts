import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
})
export class ForgotPasswordPage implements OnInit {

  constructor(private router:Router,private apiService: ApiService,private iab: InAppBrowser,) { }

  ngOnInit() {
  }

  navigateBack(){
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    if (isLoggedIn) {
      
      this.router.navigate(['/settings']); 
    } else {
      
      this.router.navigate(['/pta-login']); 
    }
  }

  email: string = '';
  showAlert = false;
  alertTitle = '';
  alertMessage = '';
  alertButtonText = '';

  showAlertPopup(title: string, message: string, buttonText: string) {
    this.alertTitle = title;
    this.alertMessage = message;
    this.alertButtonText = buttonText;
    this.showAlert = true;
  }

  closeAlert() {
    this.showAlert = false;
  }

  resetPassword() {
    if (this.email) {
      this.showAlertPopup('Request Submitted!', 'Please check your email inbox for further instructions on how to reset your password.', 'Ok');
      

      if (this.email) {
        this.apiService.resetPassword(this.email).subscribe(
          (response) => {
            if (response.status) {
              this.showAlertPopup('Request Submitted!', response.message, 'Ok');
            } else {
              this.showAlertPopup('Error', response.message, 'Ok');
            }
          },
          (error) => {
            this.showAlertPopup('Error', 'An unexpected error occurred. Please try again.', 'Ok');
          }
        );
      } else {
        this.showAlertPopup('Error', 'Please enter your email address.', 'Ok');
      }


    } else {
      this.showAlertPopup('Error', 'Please enter your email address.', 'Ok');
    }
  }

    openTerms() {
    const browser = this.iab.create('https://www.sony-mea.com/microsite/termsofuse/en', '_blank', {
      hidden: 'no',
      hardwareback: 'yes',
      fullscreen: 'no'
    });
  }

  openPrivacyPolicy() {
    const browser = this.iab.create('https://www.sony-mea.com/microsite/privacypolicy/en', '_blank', {
      hidden: 'no',
      hardwareback: 'yes',
      fullscreen: 'no'
    });
  }
  
  currentYear: number = new Date().getFullYear();

}
