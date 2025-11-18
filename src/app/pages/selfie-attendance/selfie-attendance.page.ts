import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import {
  AlertController,
  ToastController,
  Platform,
} from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';
import { Geolocation } from '@capacitor/geolocation';

@Component({
  selector: 'app-selfie-attendance',
  templateUrl: './selfie-attendance.page.html',
  styleUrls: ['./selfie-attendance.page.scss'],
})
export class SelfieAttendancePage implements OnInit {
  
  selfieBase64: string | null = null;
  selfieFileName: string | null = null;

  isCapturing = false;
  consentChecked = false;
  comment: string = '';

  isSubmitting = false;
  userId: string | null = null;
  geolocationPosition: any | null = null;

  constructor(
    private router: Router,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
    private apiService: ApiService,
    private platform: Platform
  ) {}

  ngOnInit() {
    this.userId = localStorage.getItem('userId');

    // Pre-request both permissions
    this.ensureCameraPermission();
    this.ensureLocationPermission();
  }

  // CAMERA PERMISSION
  async ensureCameraPermission() {
    try {
      const status = await Camera.checkPermissions();
      if (!status || status.camera !== 'granted') {
        const req = await Camera.requestPermissions({ permissions: ['camera'] as any });
        if (req.camera !== 'granted') {
          this.showAlert(
            'Camera required',
            'Please enable camera permission to take your selfie.'
          );
        }
      }
    } catch (e) {
      console.warn('Camera permission issue:', e);
    }
  }

  // LOCATION PERMISSION
  async ensureLocationPermission() {
    try {
      const perm = await Geolocation.checkPermissions();
      if (perm.location !== 'granted') {
        const req = await Geolocation.requestPermissions();
        if (req.location !== 'granted') {
          this.showAlert(
            'Location required',
            'GPS must be enabled to continue.'
          );
        }
      }
    } catch (e) {
      console.warn('Location permission error:', e);
    }
  }

  async onAvatarClick() {
    if (this.isCapturing) return;
    this.isCapturing = true;

    // GPS MUST BE ON BEFORE SELFIE
    const gpsOk = await this.getCurrentPosition();
    if (!gpsOk) {
      this.showAlert('GPS Required', 'Please enable GPS to continue.');
      this.isCapturing = false;
      return;
    }

    try {
      const photo = await Camera.getPhoto({
        quality: 85,
        resultType: CameraResultType.Base64,
        source: CameraSource.Camera, // NO GALLERY
        allowEditing: false,
      });

      if (photo?.base64String) {
        const ext = photo.format ?? 'jpeg';
        this.selfieBase64 = `data:image/${ext};base64,${photo.base64String}`;
        this.selfieFileName = `selfie_${Date.now()}.${ext}`;
      }

    } catch (e) {
      console.warn('Selfie capture error:', e);
    }

    setTimeout(() => (this.isCapturing = false), 600);
  }

  removeSelfie() {
    this.selfieBase64 = null;
  }

async onCancel() {
  const alert = await this.alertCtrl.create({
    header: 'Exit Attendance?',
    message: 'Are you sure you want to exit? It will not mark your attendance.',
    buttons: [
      {
        text: 'No',
        role: 'cancel'
      },
      {
        text: 'Yes, Exit',
        handler: () => {
          this.router.navigate(['/home']);
        }
      }
    ]
  });

  await alert.present();
}


  async onDone() {
    if (!this.selfieBase64) {
      return this.showAlert(
        'Selfie required',
        'Please include store background in your selfie.'
      );
    }

    if (!this.consentChecked) {
      return this.showAlert(
        'Consent Required',
        'To proceed, you must allow use of your photo and GPS for attendance.'
      );
    }

    const positionOk = await this.getCurrentPosition();
    if (!positionOk) {
      return this.showAlert(
        'GPS Required',
        'Turn ON GPS to submit attendance.'
      );
    }

    // Save selfie temporarily for display in next page
    localStorage.setItem('attendance_selfie', this.selfieBase64);

    // BACKGROUND API CALL
const payload = {
  user_id: Number(this.userId),
  action_id: 1,     // ✔ FIXED
  comment: this.comment,
  loc_latitude: this.geolocationPosition?.coords?.latitude ?? null,
  loc_longitude: this.geolocationPosition?.coords?.longitude ?? null,
  photo: this.selfieBase64,
};

this.isSubmitting = true;

this.apiService.saveAttendanceWithPhoto(payload).subscribe({
  next: () => {
    this.isSubmitting = false;

    // set state only after server confirms
    localStorage.setItem('checkin', 'true');
    this.showToast('Check-in successful!', 'success');

    // now navigate to attendance
    this.router.navigate(['/attendance']);
  },
  error: () => {
    this.isSubmitting = false;
    this.showToast('Failed to save attendance.', 'danger');
  },
});

  }

  async getCurrentPosition(): Promise<boolean> {
    try {
      const pos = await Geolocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 10000,
      });
      this.geolocationPosition = pos;
      return true;
    } catch (e) {
      return false;
    }
  }

  async showAlert(header: string, message: string) {
    const alert = await this.alertCtrl.create({
      header,
      message,
      buttons: ['OK'],
    });
    await alert.present();
  }

  async showToast(message: string, color: string) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2000,
      color,
      position: 'top',
    });
    toast.present();
  }
}
