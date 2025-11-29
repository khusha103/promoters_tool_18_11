import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-register-new-retailer',
  templateUrl: './register-new-retailer.page.html',
  styleUrls: ['./register-new-retailer.page.scss'],
})
export class RegisterNewRetailerPage implements OnInit {
  retailerName: string = ''; 
  retailerId: number = 0; 

  constructor(private apiService: ApiService, private alertController: AlertController) { }

  ngOnInit() {
    this.retailerId = 0; // Always 0 for insert case
  }

  async submitRetailer() {
    // Constructing payload
    const payload = {
      id: this.retailerId, // Use actual ID if available
      name: this.retailerName
    };

    console.log('Payload before submission:', payload);

    // Check if the payload contains the required keys
    if (payload.id !== 0 || !payload.name) {
      console.error('Payload is missing required fields: id and name');
      // Handle the error (e.g., show a message to the user)
      return;
    }

    // Show confirmation alert
    const alert = await this.alertController.create({
      header: 'Confirm Submission',
      message: 'Are you sure you want to register this retailer?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('User canceled the registration');
          }
        }, {
          text: 'Confirm',
          handler: () => {
            // Proceed with submission
            this.apiService.submitRetailerData(payload).subscribe(
              async response => {
                console.log('Retailer registered successfully:', response);
                // Show success alert
                const successAlert = await this.alertController.create({
                  header: 'Success',
                  message: 'Retailer registered successfully!',
                  buttons: ['OK']
                });
                await successAlert.present();
                // Optionally reset form fields or navigate to another page
                this.resetForm();
              },
              async error => {
                console.error('Error registering retailer:', error);
                // Show error alert
                const errorAlert = await this.alertController.create({
                  header: 'Error',
                  message: 'There was an error registering the retailer. Please try again.',
                  buttons: ['OK']
                });
                await errorAlert.present();
              }
            );
          }
        }
      ]
    });

    await alert.present();
  }

  resetForm() {
    this.retailerName = '';
    this.retailerId = 0; 
  }
}