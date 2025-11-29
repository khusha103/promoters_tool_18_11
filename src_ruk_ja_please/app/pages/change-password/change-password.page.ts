import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { ToastController } from '@ionic/angular'; 
import { ApiService } from 'src/app/services/api.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.page.html',
  styleUrls: ['./change-password.page.scss'],
})
export class ChangePasswordPage {
  newPassword: string = '';
  repeatPassword: string = '';
  email: string = '';
  passwordMismatch: boolean = false;
  errorMessage: string = '';
  usertype: any;
  constructor(private changePasswordService: ApiService, private toastController: ToastController,private userService: UserService,private router:Router) {}

  ngOnInit() {
    this.fetchUserData();
    this.usertype = localStorage.getItem('app_selection');
    console.log(this.usertype);
  }

  ionViewWillEnter() {
    this.usertype = localStorage.getItem('app_selection');
    console.log(this.usertype);
  }

  checkPasswords() {
    this.passwordMismatch = this.newPassword !== this.repeatPassword;
  }

  userData: any = {}; 

  fetchUserData() {
    const userIdString = localStorage.getItem('userId'); 
    if (userIdString) {
      const userId = parseInt(userIdString); 
      this.changePasswordService.getUserById(userId).subscribe(
        response => {
          if (response.status) {
            this.userData = response.data; 
            console.log(this.userData);
            this.email = response.data.user_email;
            console.log(this.email);
          } else {
            console.error('User not found');
          }
        },
        error => {
          console.error('Error fetching user data', error);
        }
      );
    }
  }

  async onSubmit() {
    if (!this.passwordMismatch) {
      try {
        const response = await this.changePasswordService.changePassword(this.email, this.newPassword).toPromise(); // Replace with actual email input
        if (response.status) {
          localStorage.setItem('isLoggedIn', 'false');
          // await this.presentToast('Password changed successfully!');
          await this.showToast('Password changed successfully!', 'success');

          this.router.navigate(['/pta-login']);
          // this.router.navigate(['/home']);
        } else {
          await this.presentToast(response.message);
        }
      } catch (error) {
        await this.presentToast('Something went wrong while changing password!');
      }
    }
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      position: 'bottom',
      cssClass: 'custom-toast' // Add custom class here
    });
    toast.present();
  }

  async onhappySubmit() {
    const email = this.email;

    if (this.newPassword.length >= 6 && !this.passwordMismatch) {
        this.changePasswordService.changeHpPassword(email, this.newPassword).subscribe(
            async response => {
                if (response.status) {
                    console.log(response.message);
                    localStorage.setItem('isLoggedIn', 'false');
                    // this.router.navigate(['/happy-login']);
                    this.router.navigate(['/pta-login']);

                    
                    // Show success toast
                    await this.showToast('Password changed successfully!', 'success');
                } else {
                    console.error(response.message);
                    // Show error toast
                    await this.showToast('Failed to change password: ' + response.message, 'error');
                }
            },
            async error => {
                console.error('Error changing password:', error);
                // Show error toast
                await this.showToast('An error occurred while changing the password.', 'error');
            }
        );
    } else {
        console.error('Password must be at least 6 characters and match confirmation.');
        // Optionally show validation error toast
        await this.showToast('Password must be at least 6 characters and match confirmation.', 'error');
    }
}

async showToast(message: string, type: 'success' | 'error') {
    const toast = await this.toastController.create({
        message: message,
        duration: 3000,
        color: type === 'success' ? 'success' : 'danger', 
        position: 'bottom', 
    });
    await toast.present();
}


}