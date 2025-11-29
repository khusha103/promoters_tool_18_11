import { Component, OnInit } from '@angular/core';
import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';
import { AlertController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';
import { DatePipe } from '@angular/common';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.page.html',
  styleUrls: ['./notifications.page.scss'],
  providers: [DatePipe]
})
export class NotificationsPage implements OnInit {
 
  notifications: any[] = [];
  errorMessage: string | undefined;
  userLang: string = 'en'; 

  constructor(
    private notificationService: ApiService, 
    private iab: InAppBrowser,
    private alertController: AlertController,
    private datePipe: DatePipe,
    private authservice:AuthService,
    private alertCtrl:AlertController
  ) {}

  ngOnInit() {
    this.userLang = localStorage.getItem('lang')?.toLowerCase() || 'en';
    // console.log('Current Language:', this.userLang);
    // this.loadNotifications();
    this.getUserRole();
    
  }

  // getnoti_status(){
  //   const userId = Number(localStorage.getItem('userId'));
  //   this.notificationService.getUserNotistatus(userId)
  //   .then((response: { status: any; }) => {

  //     if(response.status){

  //     }else{

  //     }
  //   }).catch(error => {
  //     console.error('Error fetching notifications', error);
  //     this.errorMessage = 'Error fetching notifications.';
  //   });
  // }

  getnoti_status() {
    const userId = Number(localStorage.getItem('userId'));
    this.notificationService.getUserNotistatus(userId)
      .subscribe({
        next: (response: { status: boolean; data: { read_ids: string; delete_ids: string } }) => {
          if (response.status && response.data) {
            const readIds = response.data.read_ids ? response.data.read_ids.split(",") : [];
            const deleteIds = response.data.delete_ids ? response.data.delete_ids.split(",") : [];
  
            // Store values in localStorage
            localStorage.setItem('readIds', readIds.join(","));
            localStorage.setItem('deleteIds', deleteIds.join(","));
          }
        },
        error: (error) => {
          console.error('Error fetching notifications', error);
          this.errorMessage = 'Error fetching notifications.';
        }
      });
  }
  
  

  ionViewWillEnter() {
    this.userLang = localStorage.getItem('lang')?.toLowerCase() || 'en';
    // console.log('Current Language:', this.userLang);
    this.getUserRole();
    // this.loadNotifications();
  }

  roleIdstring: string | null = null;
  // errorMessage: string | null = null;
  getUserRole() {
    const UserId = localStorage.getItem('userId');
    if (UserId) {
      this.authservice.getUserRole(UserId).subscribe({
        next: (response) => {
          if (response.status) {
            this.roleIdstring = response.data.role_id; // Extract role_id


            //when get roleid then call methods
            this.loadNotifications();
         
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

  
  
  loadNotifications() {
    const userId = Number(localStorage.getItem('userId'));
    const roleId = Number(this.roleIdstring);
  
    const readNotifications = localStorage.getItem('readNotifications') || "";
    const readIds = readNotifications ? readNotifications.split(",").map(id => Number(id)) : [];
    
    // Retrieve deleted notification IDs
    const deletedNotifications = localStorage.getItem('deleteIds') || "";
    const deletedIds = deletedNotifications ? deletedNotifications.split(",").map(id => Number(id)) : [];
  
    console.log("Read IDs:", readIds);
    console.log("Deleted IDs:", deletedIds);
  
    this.notificationService.getNotifications(userId, roleId)
      .then(response => {
        if (response.status) {
          this.notifications = response.message
            .filter((notification: any) => !deletedIds.includes(Number(notification.notification_id))) // Remove deleted
            .map((notification: any) => ({
              ...notification,
              title: this.getLocalizedField(notification, 'title'),
              message: this.getLocalizedField(notification, 'message'),
              formattedDate: this.formatDateInLTR(notification.notification_sent_date),
              isRead: readIds.includes(Number(notification.notification_id)) // Mark as read if stored
            }));
  
          console.log("Filtered Notifications:", this.notifications);
        } else {
          this.errorMessage = 'No Notifications';
        }
      })
      .catch(error => {
        console.error('Error fetching notifications', error);
        this.errorMessage = 'Error fetching notifications.';
      });
  }
  
  

  formatDateInLTR(date: string): string {
    // Format date in LTR, regardless of page language
    return this.datePipe.transform(date, 'dd MMM yyyy, hh:mm a', 'en-US') || '';
  }

  getLocalizedField(notification: any, fieldPrefix: string): string {
    return notification[`${fieldPrefix}_${this.userLang}`] || notification[`${fieldPrefix}_en`]; // Fallback to English
  }



  // async openNotification(notification: { notification_id: number, direct_url: string }) {
  //   console.log("full", notification);
  
  //   let readNotifications = localStorage.getItem('readNotifications');
  //   let readIds: number[] = [];
  
  //   if (readNotifications) {
  //     // Convert to numbers and remove invalid values
  //     readIds = readNotifications.split(",")
  //       .map(id => Number(id)) // Convert all to numbers
  //       .filter(id => !isNaN(id)); // Remove invalid numbers
  
  //     // Use Set to remove duplicates
  //     readIds = [...new Set(readIds)];
  //   }
  
  //   console.log("Existing read IDs:", readIds);
  
  //   // Add the new notification ID if not already present
  //   if (!readIds.includes(notification.notification_id)) {
  //     readIds.push(notification.notification_id);
  //     localStorage.setItem('readNotifications', readIds.join(",")); // Store as comma-separated values
  //   }
  
  //   // Update the UI to reflect read notifications
  //   this.notifications = this.notifications.map(notif => ({
  //     ...notif,
  //     isRead: readIds.includes(notif.notification_id),
  //   }));


  
  //   // Handle opening the notification link
  //   if (notification.direct_url?.trim()) {
  //     const browser = this.iab.create(notification.direct_url, '_blank');
  //     browser.show();
  //   } else {
  //     const alert = await this.alertController.create({
  //       header: 'No Link',
  //       message: 'This notification does not contain a link.',
  //       buttons: [
  //         {
  //           text: 'OK',
  //           handler: () => {
  //             this.loadNotifications(); // Call loadNoti() when OK is clicked
  //           }
  //         }
  //       ]
  //     });
    
  //     await alert.present();
  //   }
  //   // this.loadNotifications();
  // }

  async openNotification(notification: { notification_id: number, direct_url: string }) {
    console.log("full", notification);
  
    let readNotifications = localStorage.getItem('readNotifications');
    console.log("readNotifications",readNotifications);
    let readIds: number[] = readNotifications ? readNotifications.split(",").map(id => Number(id)) : [];

    const notiNum = Number(notification.notification_id);
  
    if (!readIds.includes(notiNum)) {
      console.log("enter");
      readIds.push(notiNum);
      localStorage.setItem('readNotifications', readIds.join(","));
  
      // Send API request to update read notifications
      this.updateNotificationStatus(readIds, null);
    }
  
    this.notifications = this.notifications.map(notif => ({
      ...notif,
      isRead: readIds.includes(notif.notification_id),
    }));
  
    if (notification.direct_url?.trim()) {
      const browser = this.iab.create(notification.direct_url, '_blank');
      browser.show();
    } else {
      const alert = await this.alertController.create({
        header: 'No Link',
        message: 'This notification does not contain a link.',
        buttons: [{ text: 'OK', handler: () => this.loadNotifications() }]
      });
  
      await alert.present();
    }
  }
  


  async confirmDelete(notificationId: number) {
    const alert = await this.alertCtrl.create({
      header: 'Delete Notification?',
      message: 'Are you sure you want to delete this notification?',
      buttons: [
        { text: 'Cancel', role: 'cancel' },
        { text: 'Delete', handler: () => this.deleteNotification(notificationId) }
      ]
    });
    await alert.present();
  }

  

  // deleteNotification(notificationId: number) {
  //   // Remove from notifications list
  //   this.notifications = this.notifications.filter(n => n.notification_id !== notificationId);

  //   // Get existing deleted IDs from localStorage
  //   let deletedIds = localStorage.getItem('deleteIds');

  //   // Convert to array, add new ID, and store it back as a comma-separated string
  //   let idArray = deletedIds ? deletedIds.split(',').map(Number) : [];
  //   idArray.push(notificationId);
  //   localStorage.setItem('deleteIds', idArray.join(','));

  //   console.log('Deleted IDs:', localStorage.getItem('deleteIds')); // Debugging log
  // }


  deleteNotification(notificationId: number) {
    this.notifications = this.notifications.filter(n => n.notification_id !== notificationId);
  
    let deletedNotifications = localStorage.getItem('deleteIds');
    let deletedIds: number[] = deletedNotifications ? deletedNotifications.split(",").map(id => Number(id)) : [];
  
    deletedIds.push(notificationId);
    localStorage.setItem('deleteIds', deletedIds.join(","));
  
    // Send API request to update deleted notifications
    this.updateNotificationStatus(null, deletedIds);
  
    console.log('Deleted IDs:', localStorage.getItem('deleteIds'));
  }

  updateNotificationStatus(readIds: number[] | null, deleteIds: number[] | null) {
    const userId = Number(localStorage.getItem('userId'));
  
    const payload = {
      user_id: userId,
      read_ids: readIds || [],
      delete_ids: deleteIds || []
    };
  
    this.notificationService.update_user_noti('/sonyNotif/saveNotificationStatus', payload).subscribe({
      next: (response: any) => {
        console.log("Notification status saved:", response);
      },
      error: (error: any) => {
        console.error("Failed to save notification status", error);
      }
    });
  }
  
  
  
  
}

