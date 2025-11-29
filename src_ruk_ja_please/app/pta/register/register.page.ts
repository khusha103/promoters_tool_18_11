import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';
import { AlertController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  firstName: string = '';
  lastName: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  
  termsAccepted: boolean = false;
  countries: any[] = [];
  retailers: any[] = [];
  outlets: any[] = [];
  selectedCountry: any;
  selectedRetailer: any;
  selectedOutlet: any;
  showAlert: boolean = false;
  alertTitle: string = '';
  alertMessage: string = '';
  alertButtonText: string = '';

  countryOptions = {
    header: 'Select Country'
  };

  retailerOptions = {
    header: 'Select Retailer'
  };

  storeOptions = {
    header: 'Select Store'
  };

  constructor(private alertController: AlertController, private apiService: ApiService, private iab: InAppBrowser,private router: Router) {}

  ngOnInit() {
    this.fetchAllCountries();
    this.termsAccepted = localStorage.getItem('termsAccepted') === 'true'; // Load acceptance state
    // this.showPTAUserConfirmation();
  }

    ionViewWillEnter() {
    // this.showPTAUserConfirmation(); // Show confirmation popup on every visit
  }

  async showPTAUserConfirmation() {
    const alert = await this.alertController.create({
      header: 'Important Notice',
      message: 'This registration form is only for PTA users. Are you sure you want to fill it out?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('User canceled registration.');
            this.router.navigate(['/pta-login']);
          }
        },
        {
          text: 'Proceed',
          handler: () => {
            console.log('User confirmed to proceed with registration.');
            
          }
        }
      ]
    });

    await alert.present();
  }

  preventDefault(event: MouseEvent) {
    event.preventDefault(); // Prevents the default anchor behavior
  }

  openTerms() {
    const browser = this.iab.create('https://www.sony-mea.com/microsite/termsofuse/en', '_blank', {
      hidden: 'no',
      hardwareback: 'yes',
      fullscreen: 'no'
    });
  }

  fetchAllCountries() {
    this.apiService.getAllCountries().subscribe(
      (response) => {
        this.countries = response.data;
      },
      (error) => {
        console.error('Error fetching countries:', error);
      }
    );
  }

  onCountryChange() {
    this.retailers = [];
    this.outlets = [];
    this.selectedRetailer = null;
    this.selectedOutlet = null;
    if (this.selectedCountry) {
      this.fetchRetailersByCountry(this.selectedCountry.id);
    }
  }

  fetchRetailersByCountry(countryId: number): Promise<void> {
    return new Promise((resolve, reject) => {
      this.apiService.getRetailersByCountry(countryId).subscribe(
        (response) => {
          if (response.status) {
            this.retailers = response.data;

            if (this.retailers.length === 0) {
              this.retailers.push({ id: null, name: 'No Retailers Found', disabled: true });
            }
            resolve();
          } else {
            this.retailers.push({ id: null, name: 'No Retailers Found', disabled: true });
            resolve();
          }
        },
        (error) => {
          console.error('Error fetching retailers:', error);
          this.retailers.push({ id: null, name: 'Error fetching retailers', disabled: true });
          reject(error);
        }
      );
    });
  }

  onRetailerChange() {
    this.outlets = []; // Clear outlets when retailer changes
    this.selectedOutlet = null; // Reset selected outlet
    if (this.selectedRetailer && this.selectedRetailer.id !== null) {
      this.fetchOutletsByRetailerAndCountry(this.selectedRetailer.id, this.selectedCountry.id);
    }
  }

  fetchOutletsByRetailerAndCountry(retailerId: number, countryId: number): Promise<void> {
    return new Promise((resolve, reject) => {
      this.apiService.getOutletsByRetailerAndCountry(retailerId, countryId).subscribe(
        (response) => {
          if (response.status) {
            this.outlets = response.data;

            if (this.outlets.length === 0) {
              this.outlets.push({ id: null, name: 'No Outlets Found', disabled: true });
            }
            resolve();
          } else {
            this.outlets.push({ id: null, name: 'No Outlets Found', disabled: true });
            resolve();
          }
        },
        (error) => {
          console.error('Error fetching outlets:', error);
          this.outlets.push({ id: null, name: 'Error fetching outlets', disabled: true });
          reject(error);
        }
      );
    });
  }

  onTermsChange() {
    localStorage.setItem('termsAccepted', String(this.termsAccepted));
  }

  ionViewWillLeave() {
    localStorage.removeItem('termsAccepted');
  }

  async register() {
    // Initialize an array to hold error messages
    const errorMessages: string[] = [];
  
    // Validate input fields
    if (!this.firstName) {
      errorMessages.push('First Name is required.');
    }
    if (!this.lastName) {
      errorMessages.push('Last Name is required.');
    }
    if (!this.email) {
      errorMessages.push('Email is required.');
    }
    if (!this.password) {
      errorMessages.push('Password is required.');
    }
    if (!this.confirmPassword) {
      errorMessages.push('Confirm Password is required.');
    }
    if (!this.selectedCountry) {
      errorMessages.push('Country selection is required.');
    }
    if (!this.selectedRetailer) {
      errorMessages.push('Retailer selection is required.');
    }
    if (!this.selectedOutlet) {
      errorMessages.push('Store selection is required.');
    }
    if (!this.termsAccepted) {
      errorMessages.push('You must accept the Terms & Conditions to proceed.');
    }
  
    // Check for password match
    if (this.password !== this.confirmPassword) {
      errorMessages.push('Passwords do not match.');
    }
  
    // If there are any errors, show them in an alert
    if (errorMessages.length > 0) {
      this.showAlertPopup('Error', errorMessages.join(' '), 'Ok');
      return; // Exit the method early
    }
  
    // If all validations pass, call the submit function
    await this.onSubmit();
  }

  async onSubmit() {
    const registrationData = {
      email: this.email,
      user_first_name: this.firstName,
      user_last_name: this.lastName,
      user_name: this.firstName.toLowerCase() + this.lastName.toLowerCase(), // Assuming username is a combination of first and last name
      password: this.password,
      country_id: this.selectedCountry.id,
      retailer_id: this.selectedRetailer.id,
      store_id: this.selectedOutlet.id,
    };

    console.log("registerdata",registrationData);
  
    try {
      const response = await this.apiService.registerUser(registrationData).toPromise();
      
      if (response.status) { // Assuming response has a status field
        // Show success message
        this.showAlertPopup('Registration Successful!', 'Your registration request has been submitted. Please check your email for further instructions.', 'Ok');
      } else {
        // Handle registration failure
        this.showAlertPopup('Registration Failed', response.message || 'An error occurred during registration.', 'Ok');
      }
      
    } catch (error) {
      console.error('Registration error:', error);
      // Handle API error
      this.showAlertPopup('Error', 'An unexpected error occurred. Please try again later.', 'Ok');
    }
  }

  showAlertPopup(title: string, message: string, buttonText: string) {
    this.alertTitle = title;
    this.alertMessage = message;
    this.alertButtonText = buttonText;
    this.showAlert = true;
  }

  closeAlert() {
    this.showAlert = false;
  }
}