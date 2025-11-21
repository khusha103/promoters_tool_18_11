import { Component, OnInit } from '@angular/core';
import { AlertController, Platform, ToastController } from '@ionic/angular';
import { Geolocation } from '@capacitor/geolocation';
import {
  AndroidSettings,
  IOSSettings,
  NativeSettings,
} from 'capacitor-native-settings';
import { Capacitor } from '@capacitor/core';
import { ApiService } from 'src/app/services/api.service';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-attendance',
  templateUrl: './attendance.page.html',
  styleUrls: ['./attendance.page.scss'],
})
export class AttendancePage implements OnInit {
  geolocationPosition: any | undefined;
  isCheckedIn: boolean = false;                 // derived from API
  selfiePreview: string | null = null;          // persisted for preview only
  weeklyData: any[] | null = null;
  isProcessing: boolean = false;
  processingAction: 'checkin' | 'checkout' | null = null;
  showForm: boolean = false; // not used for checkout UI now, kept for compatibility
  comment: string = '';
  storeId: number | null = null;
  storeName: string = '';
  retailerId: number | null = null;
  retailerName: string = '';
  countryId: number | null = null;
  roleId: string = '';
  storeDisplayName: string = 'Select Store';

  private todaysOpenRecord: any | null = null;

  constructor(
    private alertController: AlertController,
    private platform: Platform,
    private apiService: ApiService,
    private toastController: ToastController,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.storeId = params['storeId'] ? Number(params['storeId']) : null;
      this.storeName = params['storeName'] || '';
      this.retailerId = params['retailerId'] ? Number(params['retailerId']) : null;
      this.retailerName = params['retailerName'] || '';
      this.countryId = params['countryId'] ? Number(params['countryId']) : null;
      this.roleId = params['roleId'] || '';

      this.updateStoreDisplayName();
    });

    this.platform.ready().then(async () => {
      await this.checkAndRequestPermissions();
      await this.getCurrentPosition();
      // only selfie preview kept in localStorage
      this.selfiePreview = localStorage.getItem('attendance_selfie') || null;
      // load weekly attendance from the API and compute checked-in state
      this.loadWeeklyAttendance();
    });
  }

  async ionViewWillEnter() {
    await this.platform.ready();
    await this.checkAndRequestPermissions();
    await this.getCurrentPosition();
    this.selfiePreview = localStorage.getItem('attendance_selfie') || null;
    await this.loadWeeklyAttendance();
  }

  private updateStoreDisplayName() {
    if (this.storeName && this.storeName.trim().length > 0) {
      this.storeDisplayName = this.storeName;
      return;
    }
    if (String(this.roleId) === '3') {
      this.storeDisplayName = 'Assigned store unavailable';
      return;
    }
    this.storeDisplayName = 'Select Store';
  }

  onBackClick(event?: MouseEvent) {
    if (event && typeof event.preventDefault === 'function') event.preventDefault();

    const roleStr = (this.roleId && String(this.roleId).trim().length)
      ? String(this.roleId)
      : (localStorage.getItem('userRoleId') ?? localStorage.getItem('roleId') ?? '');
    const roleNum = Number(roleStr);

    if (roleNum === 16) {
      this.router.navigate(['/store-list']);
      return;
    }
    this.router.navigate(['/home']);
  }

  // Button enable/disable derived from API-driven isCheckedIn, processing state, and store selection
  get disableCheckIn(): boolean {
    // When checked in, check-in button must be disabled
    return this.isProcessing || this.isCheckedIn || (this.storeId === null);
  }

  get disableCheckOut(): boolean {
    // When not checked in, check-out must be disabled
    return this.isProcessing || !this.isCheckedIn;
  }

  // Navigate to selfie (check-in) page; selfie page will call the API for check-in.
  async onCheckIn() {
    if (this.disableCheckIn) return;

    this.isProcessing = true;
    this.processingAction = 'checkin';

    this.router.navigate(
      ['/selfie-attendance'],
      {
        queryParams: {
          storeId: this.storeId,
          storeName: this.storeName,
          retailerId: this.retailerId,
          retailerName: this.retailerName,
          countryId: this.countryId,
          roleId: this.roleId
        }
      }
    );

    // minimal UX delay so spinner visible briefly
    setTimeout(() => {
      this.isProcessing = false;
      this.processingAction = null;
    }, 600);
  }

  /**
   * confirmCheckout() shows a confirmation alert. If user confirms,
   * it calls submitAttendance() to perform the checkout.
   */
  async confirmCheckout() {
    if (this.disableCheckOut) return;

    const alert = await this.alertController.create({
      header: 'Confirm Check Out',
      message: 'Are you sure you want to check out now?',
      buttons: [
        { text: 'Cancel', role: 'cancel' },
        {
          text: 'Check Out',
          handler: () => {
            // user confirmed -> perform checkout
            this.submitAttendance();
          }
        }
      ]
    });

    await alert.present();
  }

  // Submit checkout (calls API). DO NOT navigate away here; reload API and update buttons.
  async submitAttendance() {
    if (this.isProcessing) return;

    this.isProcessing = true;
    this.processingAction = 'checkout';

    const gpsOk = await this.getCurrentPosition();
    if (!gpsOk) {
      this.isProcessing = false;
      this.processingAction = null;
      this.showToast('Unable to get location', 'danger');
      return;
    }

    const user_id = Number(localStorage.getItem('userId'));
    const user_role_id = this.roleId;
    const store_id = this.storeId;
    const store_name = this.storeName;

    if (!user_id) {
      this.isProcessing = false;
      this.processingAction = null;
      this.showToast('User not found', 'danger');
      return;
    }

    const loc_latitude = this.geolocationPosition?.coords?.latitude ?? 0;
    const loc_longitude = this.geolocationPosition?.coords?.longitude ?? 0;

    const payload: any = {
      user_id,
      action_id: 2, // checkout
      comment: this.comment || '',
      loc_latitude,
      loc_longitude,
      user_role_id,
      store_id,
      store_name
    };

    this.apiService.saveAttendance(payload).subscribe({
      next: async (res: any) => {
        this.isProcessing = false;
        this.processingAction = null;

        if (res?.status) {
          await this.showToast('Check-out successful!', 'success');

          // clear selfie preview if you prefer (kept here)
          localStorage.removeItem('attendance_selfie');

          // refresh weekly data and derive checked state from server
          await this.loadWeeklyAttendance();

          // make sure we remain on same page; leave showForm false
          this.showForm = false;
          this.comment = '';
        } else {
          this.showToast(res?.message || 'Failed to Check Out', 'danger');
        }
      },
      error: async (err) => {
        this.isProcessing = false;
        this.processingAction = null;
        console.error('checkout error:', err);
        this.showToast('Error while checking out', 'danger');
      },
    });
  }

  // Loads weekly attendance and then decides checked-in status
  async loadWeeklyAttendance() {
    const userId = Number(localStorage.getItem('userId'));
    if (!userId) {
      this.weeklyData = [];
      this.isCheckedIn = false;
      this.todaysOpenRecord = null;
      return;
    }

this.apiService.getWeeklyAttendance(userId, this.storeId ?? 0).subscribe({
next: (res: any) => {
  if (res?.status && Array.isArray(res.data)) {
    this.weeklyData = res.data;
    this.determineCheckedInFromWeeklyData();

    // If API did not yet show us as checked-in, but we just returned from selfie check-in,
    // respect the short-lived local flag so UI shows Check-Out enabled immediately.
    // This avoids a transient state where both buttons are enabled/disabled incorrectly.
    try {
      const recent = localStorage.getItem('attendance_recently_checked_in');
      if (!this.isCheckedIn && recent === '1') {
        this.isCheckedIn = true;
      }
      // consume the flag so it doesn't persist longer than necessary
      if (recent === '1') {
        localStorage.removeItem('attendance_recently_checked_in');
      }
    } catch (e) {
      // ignore storage errors
      console.warn('attendance flag handling error', e);
    }
  } else {
    this.weeklyData = [];
    this.isCheckedIn = false;
    this.todaysOpenRecord = null;
  }
},
  error: (err) => {
    console.error('Error loading weekly attendance', err);
    this.weeklyData = [];
    this.isCheckedIn = false;
    this.todaysOpenRecord = null;
  },
});

  }

// Determine check-in status from API by looking at the latest check-in row for today.
// We pick the latest record (by checkin_time) — if that record has no checkout_time then user is checked in.
private determineCheckedInFromWeeklyData() {
  this.todaysOpenRecord = null;
  this.isCheckedIn = false;

  if (!Array.isArray(this.weeklyData) || this.weeklyData.length === 0) return;

  const today = new Date().toLocaleDateString('en-CA'); // YYYY-MM-DD

  // filter entries for today
  let todaysEntries = this.weeklyData.filter((r: any) => r?.date === today);

  // prefer store-specific records if store selected
  if (this.storeId !== null && todaysEntries.length) {
    const matched = todaysEntries.filter((r: any) => Number(r.store_id) === Number(this.storeId));
    if (matched.length) todaysEntries = matched;
  }

  if (!todaysEntries.length) {
    // nothing for today
    this.todaysOpenRecord = null;
    this.isCheckedIn = false;
    return;
  }

  // Normalize checkin_time safely (if missing treat as '00:00:00')
  const entriesWithTime = todaysEntries.map((r: any) => ({
    ...r,
    _checkin_time_norm: (r.checkin_time && String(r.checkin_time).trim()) ? String(r.checkin_time).trim() : '00:00:00'
  }));

  // Sort by normalized checkin_time ascending then take last (latest)
  entriesWithTime.sort((a: any, b: any) => {
    // compare 'HH:MM:SS' strings lexicographically — works for fixed-width times
    if (a._checkin_time_norm < b._checkin_time_norm) return -1;
    if (a._checkin_time_norm > b._checkin_time_norm) return 1;
    return 0;
  });

  const latest = entriesWithTime[entriesWithTime.length - 1];

  // determine checked-in: latest exists and has no checkout_time (null or empty string)
  if (latest && (latest.checkout_time === null || latest.checkout_time === '')) {
    this.todaysOpenRecord = latest;
    this.isCheckedIn = true;
  } else {
    this.todaysOpenRecord = null;
    this.isCheckedIn = false;
  }
}

  // --- permission + helpers (unchanged) ---
  async checkAndRequestPermissions(): Promise<void> {
    try {
      if (Capacitor.isNativePlatform()) {
        const permissionStatus = await Geolocation.checkPermissions();
        if (permissionStatus.location === 'granted') return;
        const requestStatus = await Geolocation.requestPermissions();
        if (requestStatus.location !== 'granted') {
          // optional: prompt user
        }
      }
    } catch (e) {
      console.warn('Permission check failed', e);
    }
  }

  async showLocationDisabledAlert() {
    const alert = await this.alertController.create({
      header: 'Location Services Disabled',
      message: 'Please enable location services to use this feature.',
      buttons: [
        { text: 'Cancel', role: 'cancel' },
        {
          text: 'Open Settings',
          handler: () => {
            if (Capacitor.isNativePlatform()) {
              // open settings
            }
          },
        },
      ],
    });
    await alert.present();
  }

  async showLocationErrorAlert() {
    const alert = await this.alertController.create({
      header: 'Location Error',
      message: 'Unable to retrieve your location. Please try again later.',
      buttons: ['OK'],
    });
    await alert.present();
  }

  opensettings(app = false) {
    return NativeSettings.open({
      optionAndroid: app ? AndroidSettings.ApplicationDetails : AndroidSettings.Location,
      optionIOS: IOSSettings.App,
    });
  }

  async showToast(message: string, color: string) {
    const toast = await this.toastController.create({
      message,
      duration: 3000,
      color,
      position: 'top',
    });
    await toast.present();
  }

  async getCurrentPosition(): Promise<boolean> {
    try {
      const permissionStatus = await Geolocation.checkPermissions();
      if (permissionStatus?.location !== 'granted') {
        const requestStatus = await Geolocation.requestPermissions();
        if (requestStatus.location !== 'granted') {
          await this.opensettings(true);
          return false;
        }
      }
      const options: any = { maximumAge: 3000, timeout: 10000, enableHighAccuracy: true };
      const position = await Geolocation.getCurrentPosition(options);
      this.geolocationPosition = position;
      return true;
    } catch (e: any) {
      console.warn('getCurrentPosition error', e);
      return false;
    }
  }
}
