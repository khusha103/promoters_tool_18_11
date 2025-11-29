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
import { ActivatedRoute } from '@angular/router';

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
  storeId: number | null = null;
  storeName: string = '';
  retailerId: number | null = null;
  retailerName: string = '';
  countryId: number | null = null;
  roleId: string = '';

  constructor(
    private router: Router,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
    private apiService: ApiService,
    private platform: Platform,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.userId = localStorage.getItem('userId');

    this.route.queryParams.subscribe(params => {
      this.storeId = params['storeId'] ? Number(params['storeId']) : null;
      this.storeName = params['storeName'] || '';
      this.retailerId = params['retailerId'] ? Number(params['retailerId']) : null;
      this.retailerName = params['retailerName'] || '';
      this.countryId = params['countryId'] ? Number(params['countryId']) : null;
      this.roleId = params['roleId'] || '';
      console.log("Selfie Page URL Params:", params);
    });

    this.ensureCameraPermission();
    this.ensureLocationPermission();
  }

  async ensureCameraPermission() {
    try {
      const status = await Camera.checkPermissions();
      if (!status || status.camera !== 'granted') {
        const req = await Camera.requestPermissions({ permissions: ['camera'] as any });
        if (req.camera !== 'granted') {
          this.showAlert('Camera required', 'Please enable camera permission to take your selfie.');
        }
      }
    } catch (e) {
      console.warn('Camera permission issue:', e);
    }
  }

  compressBase64(base64: string, maxWidth = 600, maxHeight = 600, quality = 0.6): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = base64;

    img.onload = () => {
      const canvas = document.createElement('canvas');

      let width = img.width;
      let height = img.height;

      // Maintain aspect ratio
      if (width > height) {
        if (width > maxWidth) {
          height = height * (maxWidth / width);
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width = width * (maxHeight / height);
          height = maxHeight;
        }
      }

      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      ctx!.drawImage(img, 0, 0, width, height);

      // compress to JPEG
      const compressedBase64 = canvas.toDataURL('image/jpeg', quality);
      resolve(compressedBase64);
    };
  });
}


  async ensureLocationPermission() {
    try {
      const perm = await Geolocation.checkPermissions();
      if (perm.location !== 'granted') {
        const req = await Geolocation.requestPermissions();
        if (req.location !== 'granted') {
          this.showAlert('Location required', 'GPS must be enabled to continue.');
        }
      }
    } catch (e) {
      console.warn('Location permission error:', e);
    }
  }

  // async onAvatarClick() {
  //   if (this.isCapturing) return;
  //   this.isCapturing = true;

  //   const gpsOk = await this.getCurrentPosition();
  //   if (!gpsOk) {
  //     this.showAlert('GPS Required', 'Please enable GPS to continue.');
  //     this.isCapturing = false;
  //     return;
  //   }

  //   try {
  //     const photo = await Camera.getPhoto({
  //       quality: 85,
  //       resultType: CameraResultType.Base64,
  //       source: CameraSource.Camera,
  //       allowEditing: false,
  //     });

  //     if (photo?.base64String) {
  //       const ext = photo.format ?? 'jpeg';
  //       this.selfieBase64 = `data:image/${ext};base64,${photo.base64String}`;
  //       this.selfieFileName = `selfie_${Date.now()}.${ext}`;
  //     }
  //   } catch (e) {
  //     console.warn('Selfie capture error:', e);
  //   }

  //   setTimeout(() => (this.isCapturing = false), 600);
  // }

  async onAvatarClick() {
  if (this.isCapturing) return;
  this.isCapturing = true;

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
      source: CameraSource.Camera,
      allowEditing: false,
    });

    if (photo?.base64String) {
      const ext = photo.format ?? 'jpeg';
      const rawBase64 = `data:image/${ext};base64,${photo.base64String}`;

      // ⬇️ LIGHTWEIGHT COMPRESSED IMAGE HERE
      this.selfieBase64 = await this.compressBase64(rawBase64, 600, 600, 0.6);

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
        { text: 'No', role: 'cancel' },
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
    return this.showAlert('Selfie required', 'Please include store background in your selfie.');
  }
  if (!this.consentChecked) {
    return this.showAlert('Consent Required', 'To proceed, you must allow use of your photo and GPS for attendance.');
  }

  const positionOk = await this.getCurrentPosition();
  if (!positionOk) {
    return this.showAlert('GPS Required', 'Turn ON GPS to submit attendance.');
  }

  const userId = Number(localStorage.getItem('userId'));
  const userRoleId = this.roleId;
  const storeId = this.storeId;
  const storeName = this.storeName;

  const payload: any = {
    user_id: userId,
    action_id: 1, // check-in
    comment: this.comment,
    loc_latitude: this.geolocationPosition?.coords?.latitude ?? null,
    loc_longitude: this.geolocationPosition?.coords?.longitude ?? null,
    photo: this.selfieBase64 ?? '',
    user_role_id: userRoleId,
    store_id: storeId,
    store_name: storeName,
    retailer_id: this.retailerId,
    retailer_name: this.retailerName,
    country_id: this.countryId
  };

  this.isSubmitting = true;

  this.apiService.saveAttendanceWithPhoto(payload).subscribe({
    next: (res: any) => {
      this.isSubmitting = false;

      if (res && res.status) {
        // store selfie for preview only — DO NOT set checkin flag in localStorage
        // localStorage.setItem('attendance_selfie', this.selfieBase64 ?? '');

        this.showToast('Check-in successful!', 'success');

        // navigate back to attendance page; attendance page will re-load weekly data and determine status from API
        this.router.navigate(
          ['/attendance'],
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
      } else {
        this.showToast(res.message || 'Failed to check-in', 'danger');
      }
    },
    error: (err) => {
      this.isSubmitting = false;
      this.showToast('Error while checking in', 'danger');
      console.error('check-in error:', err);
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
