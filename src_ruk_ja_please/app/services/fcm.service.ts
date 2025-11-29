// // // import { Injectable } from '@angular/core';

// // // @Injectable({
// // //   providedIn: 'root'
// // // })
// // // export class FcmService {

// // //   constructor() { }
// // // }



// // import { Injectable } from '@angular/core';
// // import { Capacitor } from '@capacitor/core';
// // import { PushNotifications, Token } from '@capacitor/push-notifications';
// // import { StorageService } from './storage.service';
// // // import { HttpService} from '../auth.service';


// // export const FCM_TOKEN = 'push_notification_token';

// // @Injectable({
// //   providedIn: 'root'
// // })
// // export class FcmService {

// //   // constructor(private storage: StorageService , private httpservice: HttpService) {}
// //   constructor(private storage: StorageService) {}


// //   async initPush() {
// //     if (Capacitor.getPlatform() !== 'web') {
// //       await this.registerPush();
// //     }
// //   }

// //   private async registerPush() {
// //     try {
// //       await this.addListeners();
// //       let permStatus = await PushNotifications.checkPermissions();

// //       if (permStatus.receive === 'prompt') {
// //         permStatus = await PushNotifications.requestPermissions();
// //       }

// //       if (permStatus.receive !== 'granted') {
// //         throw new Error('User denied permissions');
// //       }

// //       await PushNotifications.register();
// //     } catch (e) {
// //       console.log(e);
// //     }
// //   }

// //   private async addListeners() {
// //     PushNotifications.addListener('registration', async (token: Token) => {
// //       const fcmToken = token.value;
// //       await this.storage.setStorage(FCM_TOKEN, JSON.stringify(fcmToken));
// //       // this.sendTokenToBackend(fcmToken);
// //     });

// //     PushNotifications.addListener('registrationError', (error: any) => {
// //       console.log('Error: ' + JSON.stringify(error));
// //     });

// //     // Other listeners...
// //   }

// //   async getToken(): Promise<string | null> {
// //     const savedToken = await this.storage.getStorage(FCM_TOKEN);
// //     return savedToken ? JSON.parse(savedToken.value) : null;
// //   }

// //   // sendTokenToBackend(token: string) {
// //   //   const payload = { fcm_token: token };
// //   //   this.httpservice.sendTokenToBackendAuth(payload).subscribe({
// //   //     next: (response) => {
// //   //       console.log('Token sent to backend successfully:', response);
// //   //     },
// //   //     error: (error) => {
// //   //       console.error('Error sending token to backend:', error);
// //   //     }
// //   //   });
// //   // }

// //   async removeFcmToken() {
// //     try {
// //       await this.storage.removeStorage(FCM_TOKEN);
// //     } catch (e) {
// //       console.log(e);
// //       throw e;
// //     }
// //   }
// // }



// import { Injectable } from '@angular/core';
// import { PushNotifications, Token, PushNotificationSchema, ActionPerformed } from '@capacitor/push-notifications';
// import { BehaviorSubject } from 'rxjs';

// @Injectable({
//   providedIn: 'root'
// })
// export class FcmService {
//   private tokenSubject = new BehaviorSubject<string | null>(null);
//   public token$ = this.tokenSubject.asObservable(); // Observable to access the token

//   constructor() {
//     this.notification_initialization(); // Initialize notifications when service is created
//   }

//   // Initialize push notifications
//   private notification_initialization() {
//     PushNotifications.requestPermissions().then((result) => {
//       if (result.receive === 'granted') {
//         PushNotifications.register(); // Register for push notifications
//       } else {
//         console.error('Push notification permission not granted');
//       }
//     });

//     // Listen for successful registration and store the token
//     PushNotifications.addListener('registration', (token: Token) => {
//       // console.log('Push registration success, token:', token.value);
//       this.tokenSubject.next(token.value); // Update the token subject with new token
//     });

//     // Handle registration errors
//     PushNotifications.addListener('registrationError', (error: any) => {
//       console.error('Error on registration:', JSON.stringify(error));
//     });

//     // Handle notifications received in the foreground
//     PushNotifications.addListener('pushNotificationReceived', (notification: PushNotificationSchema) => {
//       console.log('Push notification received:', JSON.stringify(notification));
//       // Handle the notification as needed
//     });

//     // Handle notification actions performed (when a user taps on a notification)
//     PushNotifications.addListener('pushNotificationActionPerformed', (notification: ActionPerformed) => {
//       console.log('Push notification action performed:', JSON.stringify(notification));
//       // Handle the action as needed, such as navigating to a specific page
//     });
//   }

//   // Method to get the latest token as a promise, returning null if undefined
//   getToken(): Promise<string | null> {
//     return this.token$.toPromise().then(token => token ?? null); // Ensure no undefined value is returned
//   }
// }

import { Injectable } from '@angular/core';
import { PushNotifications, Token, PushNotificationSchema, ActionPerformed } from '@capacitor/push-notifications';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})

export class FcmService {
  private tokenSubject = new BehaviorSubject<string | null>(null);
  public token$ = this.tokenSubject.asObservable(); // Observable to access the token

  constructor(private router: Router, ) {
    this.notification_initialization(); // Initialize notifications when service is created
  }

  // Initialize push notifications
  private notification_initialization() {
    
    PushNotifications.requestPermissions().then((result) => {
      if (result.receive === 'granted') {
        PushNotifications.register(); // Register for push notifications
      } else {
        console.error('Push notification permission not granted');
      }
    });

    // Listen for successful registration and store the token
    PushNotifications.addListener('registration', (token: Token) => {
      // console.log('Push registration success, token:', token.value);
      this.tokenSubject.next(token.value); // Update the token subject with new token
    });

    // Handle registration errors
    PushNotifications.addListener('registrationError', (error: any) => {
      console.error('Error on registration:', JSON.stringify(error));
    });

    // Handle notifications received in the foreground
    PushNotifications.addListener('pushNotificationReceived', (notification: PushNotificationSchema) => {
      console.log('Push notification received service:', JSON.stringify(notification));
      console.log('Notification data service:', notification); 
      // Handle the notification as needed
    });

    // Handle notification actions performed (when a user taps on a notification)
    // PushNotifications.addListener('pushNotificationActionPerformed', (notification: ActionPerformed) => {
    //   const data = notification.notification.data;
    //   if (data.page) {
    //     this.router.navigate([data.direct_url]);
    //   }
    //   console.log('Push notification action performed:', JSON.stringify(notification));
    //   // Handle the action as needed, such as navigating to a specific page
    // }); 
    
    PushNotifications.addListener('pushNotificationActionPerformed', (notification: ActionPerformed) => {
        const data = notification.notification.data;
        if (data && data.direct_url) {  // Check for 'direct_url' as it matches your payload
            this.router.navigateByUrl(data.direct_url);  // Navigate to the URL  data.direct_url
        } else if (data && data.link) {  // Optional: Fallback if you use 'page'
            this.router.navigateByUrl(data.link); // [data.link]
        }
        console.log('Push notification action performed:', JSON.stringify(notification));
    });

    // PushNotifications.addListener('pushNotificationActionPerformed', async (notification: ActionPerformed) => {
    //     const data = notification.notification.data;
    //     console.log('Action performed service data : ',data);
    //     if (data && data.direct_url) {
    //         await Browser.open({ url: data.direct_url });
    //     }
    // });

  }

  // Method to get the latest token as a promise, returning null if undefined
  getToken(): Promise<string | null> {
    return this.token$.toPromise().then(token => token ?? null); // Ensure no undefined value is returned
  }
}