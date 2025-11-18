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

@Component({
  selector: 'app-attendance',
  templateUrl: './attendance.page.html',
  styleUrls: ['./attendance.page.scss'],
})
export class AttendancePage implements OnInit {
  geolocationPosition: any | undefined;
  isCheckedIn: boolean = false;
  selfiePreview: string | null = null;
 weeklyData: any[] | null = null;
  isProcessing: boolean = false;
  processingAction: 'checkin' | 'checkout' | null = null; // for spinner context
  showForm: boolean = false; // checkout form visible
  comment: string = '';

  constructor(
    private alertController: AlertController,
    private platform: Platform,
    private apiService: ApiService,
    private toastController: ToastController,
    private router: Router
  ) {}

  async ngOnInit() {
    await this.platform.ready();
    await this.checkAndRequestPermissions();
    await this.getCurrentPosition(); // initial attempt (non-blocking)
    this.syncStateFromStorage();
    this.loadWeeklyAttendance();
  }

  async ionViewWillEnter() {
    await this.platform.ready();
    await this.checkAndRequestPermissions();
    await this.getCurrentPosition();
    this.syncStateFromStorage();
    this.loadWeeklyAttendance();
  }

  // read persisted flags
  private syncStateFromStorage() {
    this.isCheckedIn = localStorage.getItem('checkin') === 'true';
    this.selfiePreview = localStorage.getItem('attendance_selfie') || null;
  }

  // getters used by template to enable/disable buttons
  get disableCheckIn(): boolean {
    return this.isProcessing || this.isCheckedIn;
  }

  get disableCheckOut(): boolean {
    return this.isProcessing || !this.isCheckedIn || this.showForm;
  }

  // --- CHECK IN: navigate to selfie page (Option A)
  onCheckIn() {
    if (this.disableCheckIn) return;
    // we don't set isProcessing here permanently because check-in happens on selfie page
    this.router.navigate(['/selfie-attendance']);
  }

  // --- open checkout form on same page
  openCheckoutForm() {
    if (this.disableCheckOut) return;
    // ensure we have the selfie preview (from localStorage) and show form
    this.selfiePreview = localStorage.getItem('attendance_selfie') || null;
    this.showForm = true;
  }

  // Cancel checkout form
  cancelCheckout() {
    if (this.isProcessing) return;
    this.showForm = false;
    this.comment = '';
  }

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

  const userId = Number(localStorage.getItem('userId'));
  if (!userId) {
    this.isProcessing = false;
    this.processingAction = null;
    this.showToast('User not found', 'danger');
    return;
  }

  const lat = this.geolocationPosition?.coords?.latitude;
  const lng = this.geolocationPosition?.coords?.longitude;

  // Checkout = action_id = 0
  this.apiService.saveAttendance(userId, 0, "", lat, lng).subscribe({
    next: async (res: any) => {
      await this.showToast('Check-out successful!', 'success');

      localStorage.setItem('checkin', 'false');
      localStorage.removeItem('attendance_selfie');

      this.isCheckedIn = false;

      this.loadWeeklyAttendance();
      this.isProcessing = false;
      this.processingAction = null;

      this.router.navigate(['/home']);
    },
    error: async () => {
      this.isProcessing = false;
      this.processingAction = null;
      this.showToast('Failed to Check Out', 'danger');
    },
  });
}



  // Load weekly attendance
  loadWeeklyAttendance() {
    const userId = Number(localStorage.getItem('userId'));
    if (!userId) {
      this.weeklyData = [];
      return;
    }

    this.apiService.getWeeklyAttendance(userId).subscribe({
      next: (res: any) => {
        if (res?.status && Array.isArray(res.data)) {
          this.weeklyData = res.data;
        } else {
          this.weeklyData = [];
        }
      },
      error: (err) => {
        console.error('Error loading weekly attendance', err);
        this.weeklyData = [];
      },
    });
  }

  // Permissions check
  async checkAndRequestPermissions(): Promise<void> {
    try {
      if (Capacitor.isNativePlatform()) {
        const permissionStatus = await Geolocation.checkPermissions();
        if (permissionStatus.location === 'granted') {
          return;
        }
        const requestStatus = await Geolocation.requestPermissions();
        if (requestStatus.location !== 'granted') {
          // optional: prompt user to open settings
        }
      } else {
        // web: nothing to do, browser will ask on getCurrentPosition
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
              // open settings if needed
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

  // Get position and persist to this.geolocationPosition
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
