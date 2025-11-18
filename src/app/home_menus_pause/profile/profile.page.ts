import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActionSheetController, ModalController } from '@ionic/angular';
import { CountryModalComponent } from 'src/app/components/country-modal/country-modal.component';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  userData: any = {}; // Initialize userData
  usertype: any;
  selectedCountry: string = "";
  selectedAvatar: string = '';

  constructor(private router: Router, private apiService: ApiService, private modalController: ModalController, private actionSheetCtrl: ActionSheetController) { }
  async ngOnInit() {
    await this.fetchUserData();
    this.usertype = localStorage.getItem('app_selection');
    // console.log(this.usertype);
  }

  async ionViewWillEnter() {
    await this.fetchUserData();
    // Fetch stored country ID from localStorage
    const storedCountryId = localStorage.getItem('cnt_wip');

    if (storedCountryId) {
      this.selectedCountry = storedCountryId;
    }

    this.usertype = localStorage.getItem('app_selection');
    console.log(this.usertype);
  }

  selectedCountrypopup: any;

  displayCountryName: any;
  fetchUserData() {
    const userIdString = localStorage.getItem('userId'); // Retrieve user ID from local storage as a string
    if (userIdString) {
      const userId = parseInt(userIdString); // Convert user ID to a number
      this.apiService.getUserById(userId).subscribe(
        response => {
          if (response.status) {
            this.userData = response.data; 
            this.selectedAvatar = "/assets/avatar/"+this.userData.user_photo;
            // console.log("selected Avatar",this.response);

            // Check if multi_region_names exists and assign it accordingly
            // if(this.userData.multi_region_names) {
            //   this.displayCountryName = this.userData.multi_region_names; // Use multi_region_names for display
            // } else {
            //   this.displayCountryName = this.userData.countryname; // Fallback to countryname
            // }

            if (this.usertype == "2" || this.usertype == "1") {
              // console.log("inserted ");

              this.selectedCountrypopup = Number(localStorage.getItem('cnt_wip'));

              this.apiService.getCountryData(this.selectedCountrypopup).subscribe(
                (response) => {
                  this.selectedCountrypopup = response['0'];
                  console.log(this.selectedCountrypopup);
                  if (this.selectedCountrypopup) {
                    this.displayCountryName = this.selectedCountrypopup.name;//check for 1 usertype
              // console.log("inserted 2");


                    // console.log(this.displayCountryName);

                  }

                },
                (error) => {
                  console.error('Error fetching country data:', error);
                }
              );

            }

            console.log(this.userData);
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

  navigateToBasicDetails() {
    this.router.navigate(['/basic-details']); // Navigate to the basic-det page
  }


  //multiple country select logic

  async checkCountrySelection() {
    // Fetch stored country ID from localStorage
    const storedCountryId = localStorage.getItem('cnt_wip');

    if (storedCountryId) {
      this.selectedCountry = storedCountryId;
    }

    // if (!storedCountryId) {
    //   // If no country is stored, show the modal immediately
    //   this.openCountryModal();
    //   return;
    // }

    if (!storedCountryId) {
      // If no country is stored, show the modal with a 2-second delay
      setTimeout(() => {
        this.openCountryModal();
      }, 1000);
      return;
    }
    const userID = localStorage.getItem('userId');
    if (userID) {
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
      this.ionViewWillEnter();
      console.log('New country selected:', data);
    }
  }



  // avatars = [
  //   { name: 'Avatar 1', pic:'avatar1.png', src: '/assets/avatar/avatar1.png' },
  //   { name: 'Avatar 2', pic:'avatar2.png', src: '/assets/avatar/avatar2.png' },
  //   { name: 'Avatar 3', pic:'avatar3.png', src: '/assets/avatar/avatar3.png' },
  //   { name: 'Avatar 4', pic:'avatar4.png', src: '/assets/avatar/avatar4.png' },
  // ];

  avatars = [
    { name: 'Male Avatar 1', pic: 'avatar1.png', src: '/assets/avatar/avatar1.png'},
    { name: 'Male Avatar 2', pic: 'avatar2.png', src: '/assets/avatar/avatar2.png'},
    { name: 'Female Avatar 1', pic: 'avatar3.png', src: '/assets/avatar/avatar3.png'},
    { name: 'Female Avatar 2', pic: 'avatar4.png', src: '/assets/avatar/avatar4.png'},
  ];
  

  // async openAvatarActionSheet() {
  //   alert(
  //     "clicked"
  //   );
  //   const buttons: any[] = this.avatars.map(avatar => ({
  //     text: avatar.name,
  //     icon: 'person-circle',
  //     handler: () => {
  //       this.selectedAvatar = avatar.src;
  //     }
  //   }));

  //   // Add Cancel Button separately
  //   buttons.push({
  //     text: 'Cancel',
  //     icon: 'close',
  //     role: 'cancel'  // 'role' is only needed here
  //   });

  //   const actionSheet = await this.actionSheetCtrl.create({
  //     header: 'Select an Avatar',
  //     buttons: buttons
  //   });

  //   await actionSheet.present();
  // }

  // Open action sheet to select avatar
  async openAvatarActionSheet() {
    const buttons: any[] = this.avatars.map(avatar => ({
      text: avatar.name,
      icon: 'person-circle',
      handler: () => {
        this.selectedAvatar = avatar.src;
        this.saveAvatarSelection(avatar.pic);
      }
    }));

    buttons.push({
      text: 'Cancel',
      icon: 'close',
      role: 'cancel'
    });

    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Select an Avatar',
      buttons: buttons
    });

    await actionSheet.present();
  }

  // async openAvatarActionSheet() {
  //   const actionSheet = await this.actionSheetCtrl.create({
  //     header: 'Choose an Option',
  //     buttons: [
  //       {
  //         text: 'Gallery',
  //         icon: 'image', // Ionic icon
  //         handler: () => {
  //           console.log('Gallery clicked');
  //         },
  //       },
  //       {
  //         text: 'Camera',
  //         icon: 'camera', // Ionic icon
  //         handler: () => {
  //           console.log('Camera clicked');
  //         },
  //       },
  //       {
  //         text: 'Custom Image',
  //         icon: 'assets/avatar/avatar1.png', // Use an image from assets
  //         handler: () => {
  //           console.log('Custom Image clicked');
  //         },
  //       },
  //       {
  //         text: 'Cancel',
  //         role: 'cancel',
  //       },
  //     ],
  //   });
  //   await actionSheet.present();
  // }

  // Save selected avatar to backend
  saveAvatarSelection(avatarName: string) {
    const userID = localStorage.getItem('userId');
    if (userID) {
      this.apiService.updateUserAvatar(userID, avatarName).subscribe(response => {
        console.log('Avatar updated successfully');
      }, error => {
        console.error('Error updating avatar:', error);
      });
    }
  }




}
