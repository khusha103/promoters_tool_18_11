import { Component, OnInit } from '@angular/core';
import { AlertController, Platform, ToastController } from '@ionic/angular';
import { Geolocation, Position } from '@capacitor/geolocation';
import { AndroidSettings, IOSSettings, NativeSettings } from 'capacitor-native-settings';
import { Capacitor } from '@capacitor/core';
import { ApiService } from 'src/app/services/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-attendance',
  templateUrl: './attendance.page.html',
  styleUrls: ['./attendance.page.scss'],
})
export class AttendancePage implements OnInit {
  latitude: number | null = null;
  longitude: number | null = null;
  geolocationPosition: any | undefined;
  showGeolocationData: boolean | undefined;
  isCheckedIn!: boolean; 

  constructor(
    private alertController: AlertController,
    private platform: Platform,
    private apiService:ApiService,
    private toastController: ToastController,
    private router: Router
  ) {}

  async ngOnInit() {
    await this.platform.ready();
    this.checkAndRequestPermissions();
    this.getCurrentPosition();
    this.isCheckedIn = localStorage.getItem('checkin') === 'true';
  }

  async ionViewWillEnter() {
    await this.platform.ready();
    this.checkAndRequestPermissions();
    this.getCurrentPosition();
    this.isCheckedIn = localStorage.getItem('checkin') === 'true';
  }
  



  async checkAndRequestPermissions() {
    if (Capacitor.isNativePlatform()) {
      const permissionStatus = await Geolocation.checkPermissions();
      
      if (permissionStatus.location === 'granted') {
        this.getCurrentPosition();
      } else {
        const requestStatus = await Geolocation.requestPermissions();
        
        if (requestStatus.location === 'granted') {
          this.getCurrentPosition();
        } else {
          // this.showLocationDisabledAlert();
        }
      }
    } else {
      // Web platform
      if ('geolocation' in navigator) {
        this.getCurrentPosition();
      } else {
        console.error('Geolocation is not available in this browser');
      }
    }
  }

  // async getCurrentPosition() {
  //   try {
  //     const position = await Geolocation.getCurrentPosition();
  //     this.latitude = position.coords.latitude;
  //     this.longitude = position.coords.longitude;
  //   } catch (error) {
  //     console.error('Error getting location', error);
  //     this.showLocationErrorAlert();
  //   }
  // }

  async showLocationDisabledAlert() {
    const alert = await this.alertController.create({
      header: 'Location Services Disabled',
      message: 'Please enable location services to use this feature.',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Open Settings',
          handler: () => {
            if (Capacitor.isNativePlatform()) {
              // Geolocation.openSettings();
              
            }
          }
        }
      ]
    });

    await alert.present();
  }

  async showLocationErrorAlert() {
    const alert = await this.alertController.create({
      header: 'Location Error',
      message: 'Unable to retrieve your location. Please try again later.',
      buttons: ['OK']
    });

    await alert.present();
  }


  opensettings(app = false){
    console.log('open settings...');
    return NativeSettings.open({
      optionAndroid: app ? AndroidSettings.ApplicationDetails:AndroidSettings.Location, 
      optionIOS: IOSSettings.App
    })
  }

  // async presentCommentAlert() {
  //   const positionSuccess = await this.getCurrentPosition();
  
  //   if (positionSuccess) {
  //     // Check the check-in status from localStorage
  //     const isCheckedIn = localStorage.getItem('checkin') === 'true'; 
  
  //     const header = isCheckedIn ? 'Check Out' : 'Check In';
  //     const actionId = isCheckedIn ? 0 : 1; // 0 for checkout, 1 for check-in
  
  //     const alert = await this.alertController.create({
  //       header: header,
  //       inputs: [
  //         {
  //           name: 'comments',
  //           type: 'text',
  //           placeholder: 'Enter your comments here'
  //         }
  //       ],
  //       buttons: [
  //         {
  //           text: 'Cancel',
  //           role: 'cancel',
  //           handler: () => {
  //             console.log('Check-in/cancelation canceled');
  //           }
  //         },
  //         {
  //           text: header, 
  //           handler: async (data) => {
  //             const userId = localStorage.getItem('userId');
  //             if (!userId) {
  //               console.error('User ID not found in localStorage.');
  //               return;
  //             }
  
  //             const comment = data.comments;
  //             const loc_latitude = this.geolocationPosition?.coords.latitude;
  //             const loc_longitude = this.geolocationPosition?.coords.longitude;
  
  //             if (!loc_latitude || !loc_longitude) {
  //               console.error('Failed to retrieve geolocation data.');
  //               return;
  //             }
  
  //             // Call the API service to save attendance
  //             this.apiService.saveAttendance(userId, actionId, comment, loc_latitude, loc_longitude).subscribe(
  //               async response => {
                  
  //                 await this.showToast(isCheckedIn ? 'Check-out successful!' : 'Check-in successful!', 'success');
  //                 this.router.navigate(['/home']); 
                  
  //                 // Update localStorage based on the action
  //                 if (!isCheckedIn) {
  //                   localStorage.setItem('checkin', 'true'); // Set check-in status to true on successful check-in
  //                 } else {
  //                   localStorage.setItem('checkin', 'false'); // Set check-in status to false on successful check-out
  //                 }
  //               },
  //               async error => {
  //                 console.error('Error saving attendance:', error);
  //                 await this.showToast('Failed to Check in/out.', 'danger');
  //               }
  //             );
  //           }
  //         }
  //       ]
  //     });
  
  //     await alert.present();
  //   } else {
  //     console.log('Unable to get current position. Alert not shown.');
  //   }
  // }

  showForm: boolean = false;   // To toggle the form visibility
  comment: string = '';        // To bind the comment textarea input

toggleForm() {
  this.showForm = true;
  const isCheckedIn = localStorage.getItem('checkin') === 'true'; 
  this.isCheckedIn= isCheckedIn;
  console.log(this.isCheckedIn);
}


  async submitAttendance() {
    const positionSuccess = await this.getCurrentPosition();
    if (!positionSuccess) {
      await this.showToast('Unable to get location', 'danger');
      return;
    }
  
    const userId = localStorage.getItem('userId');
    if (!userId) {
      console.error('User ID not found.');
      return;
    }
  
    const actionId = this.isCheckedIn ? 0 : 1;
    const loc_latitude = this.geolocationPosition?.coords.latitude;
    const loc_longitude = this.geolocationPosition?.coords.longitude;
  
    this.apiService.saveAttendance(userId, actionId, this.comment, loc_latitude, loc_longitude).subscribe(
      async () => {
        await this.showToast(this.isCheckedIn ? 'Check-out successful!' : 'Check-in successful!', 'success');
        localStorage.setItem('checkin', (!this.isCheckedIn).toString());
        this.isCheckedIn = !this.isCheckedIn;
        this.comment = '';
        this.showForm = false;
      },
      async () => {
        await this.showToast('Failed to save attendance.', 'danger');
      }
    );
  }
  

  async showToast(message: string, color: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 3000,
      color: color,
      position: 'top'
    });
  
    await toast.present();
  }
  
  
  async getCurrentPosition(): Promise<boolean> {
    try {
      const permissionStatus = await Geolocation.checkPermissions();
      console.log('Permission status: ', permissionStatus.location);
      
      if (permissionStatus?.location !== 'granted') {
        const requestStatus = await Geolocation.requestPermissions();
        
        if (requestStatus.location !== 'granted') {
          // Check if location is disabled and go to location settings
          await this.opensettings(true);
          return false;
        }
      }

      let options: PositionOptions = {
        maximumAge: 3000,
        timeout: 10000,
        enableHighAccuracy: true
      };
      const position = await Geolocation.getCurrentPosition(options);
      this.geolocationPosition = position;
      console.log("Position retrieved successfully:", position);
      return true;
      
    } catch (e: any) {
      if (e?.message === 'Location services are not enabled') {
        await this.opensettings();
      }
      console.log(e);
      return false;
    }
  }
}