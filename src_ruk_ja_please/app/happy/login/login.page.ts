import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { Device } from '@capacitor/device';
import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  // username: string = '';
  // password: string = '';
  // error: string | null = null;

  // deviceInfo: any = {};
  // deviceId: any = {};
  // batteryInfo: any = {};
  // LanguageCode: any = {};

  // constructor(private authservice: AuthService, private router: Router, private toastController: ToastController) { }

  // async ngOnInit() {
  //   this.deviceInfo = await Device.getInfo();
  //   this.deviceId = await Device.getId();
  //   this.batteryInfo = await Device.getBatteryInfo();
  //   this.LanguageCode = await Device.getLanguageCode();
  // }

  // ionViewWillEnter() {
  //   this.resetform();
  // }

  // resetform() {
  //   this.username = "";
  //   this.password = "";
  // }

  // async onLogin() {
  //   const deviceInfomation = {
  //     deviceId: this.deviceId.identifier || 'unknown-device-id',
  //     deviceType: this.deviceInfo.platform || 'unknown-platform',
  //     osVersion: this.deviceInfo.osVersion || 'unknown-os-version',
  //     os: this.deviceInfo.platform || 'unknown-os',
  //     uuid: this.deviceId.identifier || 'unknown generated uuid',
  //     deviceName: this.deviceInfo.model || 'unknown device Name',
  //   };

  //   this.authservice.happylogin(this.username, this.password, deviceInfomation).subscribe(
  //     async (response) => {
  //       if (response.error) {
  //         this.error = response.message;
  //         await this.showToast(this.error || 'An unknown error occurred.');
  //       } else {
  //         // Handle successful login
  //         console.log('User:', response.user);

  //         // Store user information
  //         localStorage.setItem('isLoggedIn', 'true'); // Set login status
  //         localStorage.setItem('userId', response.user.user_id); // Store user ID
  //         localStorage.setItem('isAdmin', response.user.isAdmin);
  //         localStorage.setItem('isSuperAdmin', response.user.isSuperAdmin);
          
  //         // Check if Terms and Conditions are accepted
  //         const termsAccepted = localStorage.getItem('termsAccepted');

  //         if (termsAccepted !== 'true') {
  //           // Navigate to the Terms and Conditions page if not accepted
  //           this.router.navigate(['/terms-and-conditions']);
  //         } else {
  //           // Navigate to the home page
  //           this.router.navigate(['/home']);
  //         }
  //       }
  //     },
  //     async (error) => {
  //       // Handle error
  //       console.error('Login error:', error);
  //       await this.showToast('Login failed. Please try again.');
  //     }
  //   );
  // }

  // // Method to show toast
  // async showToast(message: string) {
  //   const toast = await this.toastController.create({
  //     message: message,
  //     duration: 3000,
  //     position: 'bottom',
  //     color: 'danger',
  //   });
  //   await toast.present();
  // }
  

  username: string = '';
  password: string = '';
  

  constructor(private router: Router, private authService: AuthService ,private iab: InAppBrowser) { }
  // constructor() {}
  deviceInfo: any = {};
  deviceId : any = {};
  batteryInfo : any = {};
  LanguageCode : any = {};

  async ngOnInit() {
    this.deviceInfo = await Device.getInfo();
    this.deviceId = await Device.getId();
    this.batteryInfo = await Device.getBatteryInfo();
    this.LanguageCode = await Device.getLanguageCode();


  }

  ionViewWillEnter(){
    this.resetform();
  }

  resetform(){
    this.username = "";
    this.password = "";
  }
  appVersion = environment.appVersion; // Accessing the app version
  // onLogin() {
  //   const deviceInfomation = {
  //       deviceId: this.deviceId.identifier || 'unknown-device-id', 
  //       deviceType: this.deviceInfo.platform || 'unknown-platform', 
  //       osVersion: this.deviceInfo.osVersion || 'unknown-os-version', 
  //       os: this.deviceInfo.platform || 'unknown-os' 
  //   };
  
  //   this.authService.login(this.username, this.password, deviceInfomation).subscribe(
  //       response => {
  //           if (response.status) {
  //               // Handle successful login
  //               // Store user ID and login status in local storage
  //               localStorage.setItem('isLoggedIn', 'true'); // Set login status
  //               localStorage.setItem('userId', response.user.user_id); // Store user ID
  //               localStorage.setItem('roleId', response.user.role_id); // Store user role ID
  //               localStorage.setItem('cid', response.user.region_id); 
  
  //               // Set app_interface based on user type indicator
  //               if (response.user_type_indicator === 'PTA') {
  //                   localStorage.setItem('app_selection', '1'); // PTA
  //               } else if (response.user_type_indicator === 'HP') {
  //                   localStorage.setItem('app_selection', '2'); // HP
  //               }
  
  //               // Check terms status from the database
  //               const userId = response.user.user_id; // Get user ID from response
  
  //               this.authService.getUserTermsStatus(userId).subscribe(
  //                   response => {
  //                       if (response.data.terms_status == 1 && response.data.app_version === this.appVersion) {
  //                           // Navigate to home page if terms are accepted
  //                           this.router.navigate(['/home']);
  //                       } else {
  //                           // Navigate to Terms and Conditions page if not accepted
  //                           this.router.navigate(['/terms-and-conditions']);
  //                       }
  //                   },
  //                   termsError => {
  //                       console.error('Error fetching terms status', termsError);
  //                       alert('Failed to check terms status. Please try again.');
  //                   }
  //               );
  //           } else {
  //               // Handle login failure
  //               alert(response.message);
  //           }
  //       },
  //       error => {
  //           console.error('Login error', error);
  //           alert('Login failed. Please try again.');
  //       }
  //   );
  // }
  

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

}
