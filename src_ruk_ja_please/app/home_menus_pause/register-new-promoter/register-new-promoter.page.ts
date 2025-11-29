import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { ToastController, AlertController, ModalController } from '@ionic/angular';
import { Router } from '@angular/router';
import { DropdownCountryComponent } from 'src/app/components/dropdown-country/dropdown-country.component';

@Component({
  selector: 'app-register-new-promoter',
  templateUrl: './register-new-promoter.page.html',
  styleUrls: ['./register-new-promoter.page.scss'],
})
export class RegisterNewPromoterPage implements OnInit {
  countries: any[] = [];
  selectedCountry: any;
  promoterName: string = '';
  employeeCode: string = '';

  constructor(
    private apiService: ApiService,
    private toastController: ToastController,
    private alertController: AlertController,
    private router: Router,
    private modalController:ModalController
  ) {}

  ngOnInit() {
    this.fetchAllCountries();
    this.generateEmployeeCode();
  }

  countryOptions = {
    header: 'Select Country'
  };

  async openCountrySelectModal() {
    const modal = await this.modalController.create({
      component: DropdownCountryComponent,
      componentProps: {  }
    });
  
    modal.onDidDismiss().then((result) => {
      if (result.data) {
        this.selectedCountry = result.data; // Get selected country from modal
        console.log('Selected Country:', this.selectedCountry);
        // this.onCountryChange();
      }
    });
  
    return await modal.present();
  }

  fetchAllCountries() {
    return new Promise((resolve, reject) => {
      this.apiService.getAllCountries().subscribe(
        (response) => {
          this.countries = response.data;
          resolve(this.countries);
        },
        (error) => {
          console.error('Error fetching countries:', error);
          reject(error);
        }
      );
    });
  }

  async generateEmployeeCode() {
    this.apiService.generateEmployeeCode().subscribe(
      (response) => {
        if (!response.error) {
          this.employeeCode = response.emp_code;
        } else {
          this.presentToast(response.message);
        }
      },
      async (error) => {
        console.error('Error generating employee code:', error);
        await this.presentToast('An error occurred while generating the employee code.');
      }
    );
  }

  async confirmSubmission() {
    const alert = await this.alertController.create({
      header: 'Confirm Submission',
      message: 'Are you sure you want to submit this promoter?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Submission canceled');
          }
        },
        {
          text: 'Submit',
          handler: () => {
            this.submitPromoter();
          }
        }
      ]
    });

    await alert.present();
  }

  async submitPromoter() {
    if (!this.promoterName || !this.selectedCountry || !this.employeeCode) {
      this.presentToast('Please fill in all fields.');
      return;
    }

    const promoterData = {
      emp_id: this.employeeCode,
      fname: this.promoterName,
      cnt_id: this.selectedCountry.id
    };

    this.apiService.insertUpdatePromoter(promoterData).subscribe(
      async (response) => {
        if (response.error) {
          await this.presentToast(response.message);
        } else {
          await this.presentToast('Registration successful!');
          this.resetFields(); // Reset fields after successful registration
          this.router.navigate(['/home']); // Redirect to home page
        }
      },
      async (error) => {
        console.error('Error submitting promoter:', error);
        await this.presentToast('An error occurred while submitting.');
      }
    );
  }

  resetFields() {
    this.promoterName = '';
    this.selectedCountry = null;
    this.employeeCode = '';
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      position: 'top'
    });
    toast.present();
  }
}