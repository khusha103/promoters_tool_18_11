import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { ApiService ,WebinarListRequest } from 'src/app/services/api.service';
import { Subscription } from 'rxjs';
import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';
import { AlertController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';



@Component({
  selector: 'app-online-webniar-list',
  templateUrl: './online-webniar-list.page.html',
  styleUrls: ['./online-webniar-list.page.scss'],
})
export class OnlineWebniarListPage implements OnInit, OnDestroy {
  private subscriptions: Subscription = new Subscription();
  webinarListData: any[] = []; // Initialize the list
  user_id!: number; // Assuming this is set somewhere in your component
  currentDateTime!: string; // Assuming this is set somewhere in your component

  constructor(private apiService: ApiService, private router: Router,private iab: InAppBrowser,private alertController: AlertController,private authservice:AuthService) {}

  ngOnInit() {
   
    this.getUserRole();
  }

  roleId: string | null = null;
  // lang: string | null = null;
  cid: string | null = null;
  errorMessage: string | null = null;
  getUserRole() {
    const UserId = localStorage.getItem('userId');
    if (UserId) {
      this.authservice.getUserRole(UserId).subscribe({
        next: (response) => {
          if (response.status) {
            this.roleId = response.data.role_id; 
            this.cid=response.data.region_id;
            
            //when get roleid then call methods
            this.setCurrentDateTime();
           
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

  ngOnDestroy() {
    this.subscriptions.unsubscribe(); // Unsubscribe to prevent memory leaks
  }
  private setCurrentDateTime() {
    const now = new Date();
    // Format the date to 'Y-m-d H:i:s'
    this.currentDateTime = now.toISOString().slice(0, 19).replace('T', ' ');
    console.log(this.currentDateTime);
    this.loadWebinarList();
    // Alternatively, if you need a specific timezone or format, consider using a library like moment.js or date-fns
  }



  async loadWebinarList() {
    const request = new WebinarListRequest();
    const userId = Number(localStorage.getItem('userId'));
    // const cnt_id = Number(localStorage.getItem('cid'));
    const cnt_id = Number(this.cid);

    // request.userId = 2890;
    request.userId = userId;
    request.source = "app";
    request.country_id = cnt_id; // Assuming user has region_id
    request.webinar_date = this.currentDateTime;

    console.log(request);

    const subscription = this.apiService.loadWebinarList(request).subscribe(
      async (response) => {
        if (response.status) {
          this.webinarListData = response.data;
          console.log(this.webinarListData);
        } else {
          await this.showErrorAlert(response.message); // Improved error handling
        }
      },
      async (error) => {
        await this.showErrorAlert(error); // Improved error handling
      }
    );

    this.subscriptions.add(subscription); // Add subscription to manage it
}



  // private showErrorAlert(message: string) {
  //   // Implement a method to show error alerts to the user
  //   console.error(message); // For debugging purposes
  //   alert(message); // Replace with a proper alert service if available
  // }

  private async showErrorAlert(message: string) {
    const alert = await this.alertController.create({
        header: 'Notification',
        message: message,
        buttons: [{
            text: 'OK',
            handler: () => {
                // Redirect to home page on OK click
                this.router.navigate(['/home']); // Adjust the path as necessary
            }
        }]
    });

    await alert.present();
}

  // openWebinar(eventId: number, iframeSource: string, btnId: number) {
  //   const extras: NavigationExtras = {
  //     state: {
  //       iframeSource,
  //       btns_id: btnId,
  //       event_id: eventId,
  //     },
  //   };
  //   this.router.navigate(['/webinar-screen'], extras); // Fixed route path
  // }



  // openWebinar(eventId: string, iframeCode: string, buttonId: string) {
  //   const browser = this.iab.create(iframeCode, '_blank', {
  //     hidden: 'no',
  //     hardwareback: 'yes',
  //     fullscreen: 'no'
  //   });
  // }

  openWebinar(eventId: string, iframeCode: string, buttonId: string) {
    // You can pass parameters using query parameters or route parameters
    this.router.navigate(['/online-webniar-screen'], {
      queryParams: {
        eventId: eventId,
        iframeCode: iframeCode,
        buttonId: buttonId,
      },
    });
  }

 
}