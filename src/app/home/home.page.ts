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
  promoterStoreId!: number | null;
  promoterStoreName: any;
  promoterRetailerId!: number | null;
  promoterRetailerName: any;

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

iconClick(icon: any) {
  // Attendance icon menu-id = 15
  if (icon['menu-id'] === 15) {
    // If user role is not allowed -> show toast and do not navigate
    // Allowed roles: 3 (promoter) and 16 (other permitted role)
    const roleNum = Number(this.roleId);
    if (![3, 16].includes(roleNum)) {
      // Use existing helper which displays toast
      this.showToast('Attendance module is not available for your role.');
      return;
    }
    // role allowed -> proceed to attendance navigation
    this.handleAttendanceNavigation();
    return;
  }

  // Default navigation for all other icons
  if (icon.routerLink) {
    this.router.navigate([icon.routerLink]);
  }
}

// Helper that returns a promise and fetches outlet if not already loaded
private fetchPromoterOutletOnce(): Promise<void> {
  return new Promise((resolve, reject) => {
    const userId = Number(localStorage.getItem('userId'));
    if (!userId) {
      return reject('no userId');
    }

    // if already loaded, resolve immediately
    if (this.promoterStoreId !== null || this.promoterStoreName) {
      return resolve();
    }

    const sub = this.apiService.getOutletByUserId(userId).subscribe({
      next: (res: any) => {
        if (res && res.status && res.data) {
          this.promoterStoreId = res.data.store_id ? Number(res.data.store_id) : null;
          this.promoterStoreName = res.data.store_name || '';
          this.promoterRetailerId = res.data.retailer_id ? Number(res.data.retailer_id) : null;
          this.promoterRetailerName = res.data.retailer_name || '';
        } else {
          this.promoterStoreId = null;
          this.promoterStoreName = '';
          this.promoterRetailerId = null;
          this.promoterRetailerName = '';
        }
        sub.unsubscribe();
        resolve();
      },
      error: (err: any) => {
        sub.unsubscribe();
        reject(err);
      }
    });
  });
}


// make function async to allow waiting for promoter outlet fetch when needed
async handleAttendanceNavigation() {
  // Defensive: ensure roleId is available
  if (!this.roleId) {
    console.error("Role ID not available yet.");
    // show friendly toast
    this.showToast('Attendance module is not available for your role.');
    return;
  }

  const role = Number(this.roleId);

  // Only roles 3 and 16 are allowed — otherwise show message and do not navigate
  if (![3, 16].includes(role)) {
    this.showToast('Attendance module is not available for your role.');
    return;
  }

  // Role 16: navigate to store-list (existing behavior)
  if (role === 16) {
    this.router.navigate(['/store-list']);
    return;
  }

  // If promoter (role 3) and we don't yet have the outlet loaded, attempt to fetch it synchronously
  if (role === 3) {
    // If outlet already loaded in component state, use it.
    if ((this.promoterStoreId === null || this.promoterStoreId === undefined) && !this.promoterStoreName) {
      // attempt to fetch once (wrap observable in promise)
      try {
        await this.fetchPromoterOutletOnce();
      } catch (e) {
        console.warn('Failed to prefetch promoter outlet before navigation', e);
        // proceed anyway — attendance page can handle missing store selection
      }
    }
  }

  // Build query params using component values (fallback to localStorage if still needed)
  const qparams: any = {
    storeId: this.promoterStoreId ?? (localStorage.getItem('storeId') ? Number(localStorage.getItem('storeId')) : null),
    storeName: this.promoterStoreName || localStorage.getItem('storeName') || '',
    retailerId: this.promoterRetailerId ?? (localStorage.getItem('retailerId') ? Number(localStorage.getItem('retailerId')) : null),
    retailerName: this.promoterRetailerName || localStorage.getItem('retailerName') || '',
    countryId: this.cid ?? (localStorage.getItem('countryId') ? Number(localStorage.getItem('countryId')) : null),
    roleId: this.roleId ?? ''
  };

  this.router.navigate(['/attendance'], { queryParams: qparams });
}




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
  if (!UserId) return;

  this.authservice.getUserRole(UserId).subscribe({
    next: (response) => {
      if (response.status) {
        this.roleId = response.data.role_id; // Extract role_id
        this.cid = response.data.region_id;

        // Save role to localStorage so other pages can read it
        localStorage.setItem('userRoleId', String(this.roleId));

        //when get roleid then call methods
        this.load_menusbyroles();
        this.loadBanners();
        this.noInternet();

        // If promoter -> fetch fixed store for this user and save to localStorage
// If promoter -> fetch assigned outlet and keep in component properties
if (String(this.roleId) === '3') {
  const userIdNum = Number(UserId);

  // fetch outlet and store in memory (and optionally persist)
  this.apiService.getOutletByUserId(userIdNum).subscribe({
    next: (res: any) => {
      if (res && res.status && res.data) {
        // Save to component state
        this.promoterStoreId = res.data.store_id ? Number(res.data.store_id) : null;
        this.promoterStoreName = res.data.store_name || '';
        this.promoterRetailerId = res.data.retailer_id ? Number(res.data.retailer_id) : null;
        this.promoterRetailerName = res.data.retailer_name || '';

        // OPTIONAL: persist to localStorage if other parts of app still expect it
        // localStorage.setItem('storeId', String(this.promoterStoreId ?? ''));
        // localStorage.setItem('storeName', this.promoterStoreName);
        // if (this.promoterRetailerId) localStorage.setItem('retailerId', String(this.promoterRetailerId));
        // if (this.promoterRetailerName) localStorage.setItem('retailerName', this.promoterRetailerName);
      } else {
        console.warn('No outlet data for promoter', res);
        // clear component values
        this.promoterStoreId = null;
        this.promoterStoreName = '';
        this.promoterRetailerId = null;
        this.promoterRetailerName = '';
      }
    },
    error: (err: any) => {
      console.error('Error fetching outlet for promoter', err);
      // clear component values on error
      this.promoterStoreId = null;
      this.promoterStoreName = '';
      this.promoterRetailerId = null;
      this.promoterRetailerName = '';
    }
  });
}


      } else {
        this.errorMessage = response.message;
      }
    },
    error: (error) => {
      console.error('API Error:', error);
      this.errorMessage = 'Failed to retrieve user role. Please try again later.';
    }
  });
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
