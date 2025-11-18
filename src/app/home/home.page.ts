import { HttpClient } from '@angular/common/http';
import { Component, ViewChild } from '@angular/core';
import { ApiService } from '../services/api.service';
import { NetworkService } from '../services/network.service';
import { Router } from '@angular/router';
import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';
import { AlertController, ToastController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';
import { Device } from '@capacitor/device';
// import { SwiperComponent } from 'swiper/angular';
import { environment } from 'src/environments/environment';




@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  homeIcons: any[] = [];
  roles: any[] = [];
  rolemenus: any[] = [];
  accessIds: string[] = []; // Declare accessIds as an array of strings
  banners: any[] = [];

  constructor(private authservice: AuthService, private http: HttpClient, private apiService: ApiService, private networkService: NetworkService, private router: Router, private iab: InAppBrowser, private alertController: AlertController, private toastController: ToastController) { }
  deviceInfo: any = {};
  deviceId: any = {};
  batteryInfo: any = {};
  LanguageCode: any = {};
  homeIconsimage: any[] = [];

  async ngOnInit() {

    // this.load_menusbyroles();
    // this.loadBanners();
    // this.noInternet();

    // this.getUserRole();

    this.getnoti_status();

    this.deviceInfo = await Device.getInfo();
    // console.log(this.deviceInfo);
    this.deviceId = await Device.getId();
    this.batteryInfo = await Device.getBatteryInfo();
    this.LanguageCode = await Device.getLanguageCode();


    // this.checkLogintoken();
  }

  // @ViewChild('swiper', { static: false }) swiper!: SwiperComponent;

  // ngAfterViewInit() {
  //   this.swiper.swiperRef.on('slideChange', () => {
  //     this.swiper.swiperRef.pagination.update();
  //   });
  // }

//   async checkLogintoken() {
//     // Get user_id from local storage
//     const userId = Number(localStorage.getItem('userId'));

//     if (!userId) {
//         console.error("User ID not found in local storage!");
//         return;
//     }

//     const deviceInformation = {
//         deviceId: this.deviceId.identifier || 'unknown-device-id',
//         deviceType: this.deviceInfo.platform || 'unknown-platform',
//         osVersion: this.deviceInfo.osVersion || 'unknown-os-version',
//         os: this.deviceInfo.platform || 'unknown-os',
//         model: this.deviceInfo.model || 'unknown-model'
//     };

//     console.log("Device Info",deviceInformation);

//     // Call API using authService.getdetails()
//     this.authservice.getdetails(userId, deviceInformation).subscribe(
//         async (response: any) => {
//             if (response && response.status) {
//                 console.log('Device Verified:', response.message);
//             } else if (response && response.message === 'Your account is logged in on another device.') {
//                 // Show alert and log the user out
//                 const alert = await this.alertController.create({
//                     header: 'Alert',
//                     message: response.message,
//                     buttons: [
//                         {
//                             text: 'OK',
//                             handler: () => {
//                               localStorage.clear();
//                               this.router.navigate(['/pta-login']);
//                             }
//                         }
//                     ]
//                 });

//                 await alert.present();
//             } else if (response && response.message === 'User not found') {
//                 console.error('User not found:', response);
//             } else {
//                 console.error('Unexpected API response:', response);
//             }
//         },
//         (error) => {
//             console.error('Error fetching user device details:', error);
//         }
//     );
// }





async checkLogintoken() {
  // Get user_id from local storage
  const userId = Number(localStorage.getItem('userId'));

  if (!userId) {
      console.error("User ID not found in local storage!");
      return;
  }

  const deviceInformation = {
      deviceId: this.deviceId.identifier || 'unknown-device-id',
      deviceType: this.deviceInfo.platform || 'unknown-platform',
      osVersion: this.deviceInfo.osVersion || 'unknown-os-version',
      os: this.deviceInfo.platform || 'unknown-os',
      model: this.deviceInfo.model || 'unknown-model'
  };

  console.log("Device Info", deviceInformation);

  // Call API using authService.getdetails()
  this.authservice.getdetails(userId, deviceInformation).subscribe(
      async (response: any) => {
          if (response && response.status) {
              console.log('Device Verified:', response.message);
          } else if (response && response.message === 'Your account is logged in on another device.') {
              // Show alert and log the user out
              const alert = await this.alertController.create({
                  header: 'Alert',
                  message: response.message,
                  backdropDismiss: false, // Prevent closing on clicking outside
                  buttons: [
                      {
                          text: 'OK',
                          handler: () => {
                              localStorage.clear();
                              this.router.navigate(['/pta-login']);
                          }
                      }
                  ]
              });

              await alert.present();
          } else if (response && response.message === 'User not found') {
              console.error('User not found:', response);
          } else {
              console.error('Unexpected API response:', response);
          }
      },
      (error) => {
          console.error('Error fetching user device details:', error);
      }
  );
}



  roleId: string | null = null;
  cid: string | null = null;
  errorMessage: string | null = null;
  getUserRole() {
    const UserId = localStorage.getItem('userId');
    if (UserId) {
      this.authservice.getUserRole(UserId).subscribe({
        next: (response) => {
          if (response.status) {
            this.roleId = response.data.role_id; // Extract role_id
            this.cid = response.data.region_id;

            //when get roleid then call methods
            this.load_menusbyroles();
            this.loadBanners();
            this.noInternet();
          } else {
            this.errorMessage = response.message; // Handle error message
          }
        },
        error: (error) => {
          console.error('API Error:', error);
          this.errorMessage = 'Failed to retrieve user role. Please try again later.';
        }
      });
    }
  }

  getnoti_status() {
    const userId = Number(localStorage.getItem('userId'));
    this.apiService.getUserNotistatus(userId)
      .subscribe({
        next: (response: { status: boolean; data: { read_ids: string; delete_ids: string } }) => {
          if (response.status && response.data) {
            const readIds = response.data.read_ids ? response.data.read_ids.split(",") : [];
            const deleteIds = response.data.delete_ids ? response.data.delete_ids.split(",") : [];
  
            
            localStorage.setItem('readNotifications', readIds.join(","));
            localStorage.setItem('deleteIds', deleteIds.join(","));

          }
        },
        error: (error) => {
          console.error('Error fetching notifications', error);
          this.errorMessage = 'Error fetching notifications.';
        }
      });
  }


  async ionViewWillEnter() {
    // console.log("debug check");
    // this.load_menusbyroles();
    // this.loadBanners();
    // this.noInternet();

    this.getUserRole();

    this.getnoti_status();

    this.deviceInfo = await Device.getInfo();
    // console.log(this.deviceInfo);
    this.deviceId = await Device.getId();
    this.batteryInfo = await Device.getBatteryInfo();
    this.LanguageCode = await Device.getLanguageCode();

    this.checkLogintoken();
  }

  async noInternet() {
    const isConnected = await this.networkService.checkNetwork();
    if (isConnected) {
      this.router.navigate(['/home']);
    } else {

      this.router.navigate(['/no-internet']);
    }
  }

  loadBanners() {
    this.apiService.getBanners().subscribe(
      (data) => {
        this.banners = data.map((banner: { imageUrl: any; redirect_url: string; }) => {
          return {
            ...banner,
            // imageUrl: `https://ekarigartech.com/erp/${banner.imageUrl}` 
            imageUrl: `${environment.apiBaseUrl}/${banner.imageUrl}` 

          };
        });
      },
      (error) => {
        console.error('Error fetching banners', error);
      }
    );
  }



  async openUrl(url: string) {
    if (!url) {
      this.showToast('No URL linked to this slide.');
      return;
    }

    const alert = await this.alertController.create({
      header: 'Redirect Notice',
      message: 'This slide will take you to an external webpage. Do you want to continue?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('User canceled the redirection');
          }
        },
        {
          text: 'Proceed',
          handler: () => {
            this.openWebPage(url);
          }
        }
      ]
    });

    await alert.present();
  }

  openWebPage(url: string) {
    const browser = this.iab.create(url, '_blank', {
      hidden: 'no',
      hardwareback: 'yes',
      fullscreen: 'no'
    });
    browser.show();
  }

  async showToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      position: 'bottom'
    });
    toast.present();
  }


  load_menusbyroles() {
    const appSelector = localStorage.getItem('app_selection');

    if (appSelector === '1' || appSelector === '2') {
      console.log("goes here");
      // const roleId = Number(localStorage.getItem('roleId'));
      const roleId = Number(this.roleId);
      // console.log("role id ", roleId);
      // const countryId = localStorage.getItem('cid');
      const countryId = this.cid;


      if (countryId !== null) {
        this.apiService.getrolemenus(roleId, countryId).subscribe(
          response => {
            // console.log('Role menus loaded:', response);

            // Check if the response status is success
            if (response.status === 'success') {
              // this.rolemenus = response.data.menus; // Access menus directly
              this.accessIds = response.data.access_id; // Access unique access IDs

              if (this.rolemenus.length > 0) {
                // If there are menus, process them
                // console.log('Menus loaded:', this.rolemenus);
                this.loadHomeIcons();
              } else {
                console.warn('No role menus found');
                this.loadHomeIcons(); // Load home icons even if no menus are found
              }
            } else {
              console.warn('Status is not success:', response);
              this.loadHomeIcons(); // Load home icons on failure
            }
          },
          error => console.error('Error loading role menus:', error)
        );
      } else {
        console.log('countryId is null, not checking for role menus');
        this.loadHomeIcons();
      }
    }
    //  else {
    //   console.log('app_selection is 2, not checking for role_id');

    //   //hp menu app selection
    //   const roleId = Number(this.roleId);
    //   const countryId = this.cid;
    //   if (countryId !== null) {
    //     this.apiService.menuaccess_hpuser_get(roleId, countryId).subscribe(
    //       response => {
    //         console.log('Role menus loaded:', response);

    //         // Check if the response status is success
    //         if (response.status === 'success') {
    //           // this.rolemenus = response.data.menus; // Access menus directly
    //           this.accessIds = response.data.access_id; // Access unique access IDs

    //           console.log("Access Ids",this.accessIds);

    //           if (this.rolemenus.length > 0) {
    //             // If there are menus, process them
    //             // console.log('Menus loaded:', this.rolemenus);
    //             this.loadHomeIcons();
    //           } else {
    //             console.warn('No role menus found');
    //             this.loadHomeIcons(); // Load home icons even if no menus are found
    //           }
    //         } else {
    //           console.warn('Status is not success:', response);
    //           this.loadHomeIcons(); // Load home icons on failure
    //         }
    //       },
    //       error => console.error('Error loading role menus:', error)
    //     );
    //   } else {
    //     console.log('countryId is null, not checking for role menus');
    //     this.loadHomeIcons();
    //   }
    //   this.loadHomeIcons();
    // }
  }

  loadHomeIcons() {
    // Load home icons from JSON
    this.http.get('../assets/home-icons.json').subscribe((data: any) => {
      this.homeIcons = data.homeIcons;

      const appSelector = localStorage.getItem('app_selection');

      // Filter home icons based on app-selector
      if (appSelector === '1') {
        // console.log("Filtering home icons based on role menus");

        // Ensure accessIds are loaded before filtering
        if (this.accessIds && this.accessIds.length > 0) {
          this.homeIcons = this.homeIcons.filter(icon =>
            this.accessIds.includes(icon['menu-id'].toString()) &&
            icon['app-selector'].split(',').includes('1')
          );
          // console.log("Filtered home icons:", this.homeIcons);
        } else {

          this.homeIcons=[];
          console.warn('No access IDs available for filtering');
        }
      } else if (appSelector === '2') {


        // If app-selector is '2', filter for app-selector 2
        // this.homeIcons = this.homeIcons.filter(icon => icon['app-selector'].split(',').includes('2'));
        if (this.accessIds && this.accessIds.length > 0) {
          this.homeIcons = this.homeIcons.filter(icon =>
            this.accessIds.includes(icon['menu-id'].toString()) &&
            icon['app-selector'].split(',').includes('2')
          );
          // console.log("Filtered home icons:", this.homeIcons);
        } else {
          //load zero icons
          this.homeIcons=[];
          console.warn('No access IDs available for filtering');
        }
        // console.log("Filtered home icons for app-selector 2:", this.homeIcons);
      } else {
        console.log("No selection of APP");
      }
    });
  }

  getRows(array: any[], rowSize: number = 3): any[][] {
    const rows: any[][] = [];
    for (let i = 0; i < array.length; i += rowSize) {
      rows.push(array.slice(i, i + rowSize));
    }
    return rows;
  }
}
