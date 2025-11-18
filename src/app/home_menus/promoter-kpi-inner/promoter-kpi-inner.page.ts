// // import { Component, OnInit, ViewChild } from '@angular/core';
// // import { IonSelect } from '@ionic/angular';
// // import { ApiService } from 'src/app/services/api.service';
// // import { UserService } from 'src/app/services/user.service';

// // @Component({
// //   selector: 'app-promoter-kpi-inner',
// //   templateUrl: './promoter-kpi-inner.page.html',
// //   styleUrls: ['./promoter-kpi-inner.page.scss'],
// // })
// // export class PromoterKpiInnerPage implements OnInit {

// //   @ViewChild('monthSelect') monthSelect?: IonSelect;
// //   selectedMonth: string | null = null;

// //    // Define months directly in the component
// //    months: Array<{ value: number, name: string }> = [
// //     { value: 1, name: 'January' },
// //     { value: 2, name: 'February' },
// //     { value: 3, name: 'March' },
// //     { value: 4, name: 'April' },
// //     { value: 5, name: 'May' },
// //     { value: 6, name: 'June' },
// //     { value: 7, name: 'July' },
// //     { value: 8, name: 'August' },
// //     { value: 9, name: 'September' },
// //     { value: 10, name: 'October' },
// //     { value: 11, name: 'November' },
// //     { value: 12, name: 'December' }
// //   ];

// //   errorMessage: string = '';
// //   kpiScores: any[] = [];
// //   selectedmonths: number[] = []; // Array to hold selected month values

// //   constructor(private userService:UserService,private kpiScoreService:ApiService) {}

// //   ngOnInit() {
// //     this.fetchUserData();
// //     // this.loadKpiScores();
// //   }
// //   ionViewWillEnter() {
// //     this.resetSelectedMonths();
// //   }

// //   resetSelectedMonths() {
// //     this.selectedmonths = []; // Reset the selected months array
// //   }

// //   userData: any = {}; // Initialize an object to hold user data

// //   fetchUserData() {
// //     const userIdString = localStorage.getItem('userId');
// //     const userId = userIdString ? Number(userIdString) : null;

// //     if (userId !== null) {
// //       this.userService.fetchUserData(userId).subscribe(
// //         (response) => {
// //           if (response.status) {
// //             this.userData = {
// //               firstName: response.data.user_first_name,
// //               lastName: response.data.user_last_name,
// //               retailerName: response.data.retailer_name,
// //               storeName: response.data.store_name,
// //               categories: response.data.categories,
// //               country: response.data.countryname
// //             };
// //             // this.fetchIncentives();
// //           } else {
// //             this.errorMessage = 'Failed to fetch user data: ' + response.message;
// //             // this.isLoading = false;
// //           }
// //         },
// //         (error) => {
// //           this.errorMessage = 'Error fetching user data: ' + error.message;
// //           // this.isLoading = false;
// //         }
// //       );
// //     } else {
// //       this.errorMessage = 'User ID is not available.';
// //       // this.isLoading = false;
// //     }
// //   }


// //   openMonthSelect() {
// //     this.monthSelect?.open();
// //   }



// //   onMonthSelect(event: any) {
// //     const selectedValue = event.detail.value; // Get the selected month value
// //     this.selectedmonths = event.detail.value; // Get the array of selected month values
// //     console.log('Selected Months:', this.selectedmonths);
// //     const selectedMonthObj = this.months.find(month => month.value === selectedValue); // Find the corresponding month object
// //     this.selectedMonth = selectedMonthObj ? selectedMonthObj.name : null; // Update selectedMonth with the month name

// //     this.loadKpiScores();
// //   }

// //   userId: number = 2893; // User ID from input
// //   // selectedmonths: number[] = [8, 9]; // Months from input
  

// //   // Method to get month name from month number
// //   getMonthName(monthNumber: number): string {
// //     const month = this.months.find(m => m.value == monthNumber);//shows undefined
// //     return month ? month.name : '';
// //   }

 

// //   // loadKpiScores() {
// //   //     // Convert selectedmonths array to a comma-separated string
// //   //     const monthsString = this.selectedmonths.join(',');
// //   //   this.kpiScoreService.getKpiScore(this.userId, monthsString).subscribe(
// //   //     response => {
// //   //       if (response.status) {
// //   //         this.kpiScores = response.message; // Assuming message contains the data array
// //   //         console.log(this.kpiScores);
// //   //       } else {
// //   //         this.errorMessage = response.message; // Handle error message
// //   //       }
// //   //     },
// //   //     error => {
// //   //       this.errorMessage = 'An error occurred while fetching data.';
// //   //     }
// //   //   );
// //   // }

// //   totalTtlPercentage:any;

// //   loadKpiScores() {
// //     // Convert selectedmonths array to a comma-separated string
// //     const monthsString = this.selectedmonths.join(',');
// //     this.kpiScoreService.getKpiScore(this.userId, monthsString).subscribe(
// //         response => {
// //             if (response.status) {
// //                 this.kpiScores = response.message; // Assuming message contains the data array
// //                 console.log(this.kpiScores);

// //                 // Calculate total TTL percentage
// //                 const validTtlEntries = this.kpiScores.filter(score => score.ttl_ranking !== null).map(score => parseFloat(score.ttl_ranking));
// //                 const ttlSum = validTtlEntries.reduce((sum, value) => sum + value, 0);
// //                 this.totalTtlPercentage = validTtlEntries.length > 0 ? (ttlSum / validTtlEntries.length) : 0;
// //             } else {
// //                 this.errorMessage = response.message; // Handle error message
// //             }
// //         },
// //         error => {
// //             this.errorMessage = 'An error occurred while fetching data.';
// //         }
// //     );
// // }



// // }
// import { Component, OnInit, ViewChild } from '@angular/core';
// import { IonSelect } from '@ionic/angular';
// import { ApiService } from 'src/app/services/api.service';
// import { AuthService } from 'src/app/services/auth.service';
// import { UserService } from 'src/app/services/user.service';

// @Component({
//   selector: 'app-promoter-kpi-inner',
//   templateUrl: './promoter-kpi-inner.page.html',
//   styleUrls: ['./promoter-kpi-inner.page.scss'],
// })
// export class PromoterKpiInnerPage implements OnInit {

//   @ViewChild('monthSelect') monthSelect?: IonSelect;
//   selectedMonth: string | null = null;

//    // Define months directly in the component
//    months: Array<{ value: number, name: string }> = [
//     { value: 1, name: 'January' },
//     { value: 2, name: 'February' },
//     { value: 3, name: 'March' },
//     { value: 4, name: 'April' },
//     { value: 5, name: 'May' },
//     { value: 6, name: 'June' },
//     { value: 7, name: 'July' },
//     { value: 8, name: 'August' },
//     { value: 9, name: 'September' },
//     { value: 10, name: 'October' },
//     { value: 11, name: 'November' },
//     { value: 12, name: 'December' }
//   ];

//   errorMessage: string = '';
//   kpiScores: any[] = [];
//   selectedmonths: number[] = []; // Array to hold selected month values

//   constructor(private userService:UserService,private kpiScoreService:ApiService,private authservice:AuthService) {}

//   ngOnInit() {
//     this.fetchUserData();
//     // this.loadKpiScores();
    
//   }
//   ionViewWillEnter() {
//     this.resetSelectedMonths();
//     this.getUserRole();
//   }

//   roleId: string | null = null;
//     lang: string | null = null;
//     cid: string | null = null;
//     userRole:number | 0 = 0;
//     // errorMessage: string | null = null;
//     getUserRole() {
//       const UserId = localStorage.getItem('userId');
//       if (UserId) {
//         this.authservice.getUserRole(UserId).subscribe({
//           next: (response) => {
//             if (response.status) {
//               this.roleId = response.data.role_id; 
//               this.userRole = response.data.role_id; 
//               console.log(this.roleId);
//               this.cid=response.data.region_id;
//               this.lang =response.data.user_lang;
//               //when get roleid then call methods
              
//             } else {
//               this.errorMessage = response.message; // Handle error message
//             }
//           },
//           error: (error) => {
//             console.error('API Error:', error);
//             this.errorMessage = 'Failed to retrieve user role. Please try again later.';
//           }
//         });
//       }
//     }

//   resetSelectedMonths() {
//     this.selectedmonths = []; // Reset the selected months array
//   }

//   userData: any = {}; // Initialize an object to hold user data

//   fetchUserData() {
//     const userIdString = localStorage.getItem('userId');
//     const userId = userIdString ? Number(userIdString) : null;

//     if (userId !== null) {
//       this.userService.fetchUserData(userId).subscribe(
//         (response) => {
//           if (response.status) {
//             this.userData = {
//               firstName: response.data.user_first_name,
//               lastName: response.data.user_last_name,
//               retailerName: response.data.retailer_name,
//               storeName: response.data.store_name,
//               categories: response.data.categories,
//               country: response.data.countryname
//             };
//             // this.fetchIncentives();
//           } else {
//             this.errorMessage = 'Failed to fetch user data: ' + response.message;
//             // this.isLoading = false;
//           }
//         },
//         (error) => {
//           this.errorMessage = 'Error fetching user data: ' + error.message;
//           // this.isLoading = false;
//         }
//       );
//     } else {
//       this.errorMessage = 'User ID is not available.';
//       // this.isLoading = false;
//     }
//   }


//   openMonthSelect() {
//     this.monthSelect?.open();
//   }



//   onMonthSelect(event: any) {
//     const selectedValue = event.detail.value; // Get the selected month value
//     this.selectedmonths = event.detail.value; // Get the array of selected month values
//     console.log('Selected Months:', this.selectedmonths);
//     const selectedMonthObj = this.months.find(month => month.value === selectedValue); // Find the corresponding month object
//     this.selectedMonth = selectedMonthObj ? selectedMonthObj.name : null; // Update selectedMonth with the month name

//     this.loadKpiScores();
//   }

//   userId: number = 2893; // User ID from input
//   // selectedmonths: number[] = [8, 9]; // Months from input
  

//   // Method to get month name from month number
//   getMonthName(monthNumber: number): string {
//     const month = this.months.find(m => m.value == monthNumber);//shows undefined
//     return month ? month.name : '';
//   }

 

//   // loadKpiScores() {
//   //     // Convert selectedmonths array to a comma-separated string
//   //     const monthsString = this.selectedmonths.join(',');
//   //   this.kpiScoreService.getKpiScore(this.userId, monthsString).subscribe(
//   //     response => {
//   //       if (response.status) {
//   //         this.kpiScores = response.message; // Assuming message contains the data array
//   //         console.log(this.kpiScores);
//   //       } else {
//   //         this.errorMessage = response.message; // Handle error message
//   //       }
//   //     },
//   //     error => {
//   //       this.errorMessage = 'An error occurred while fetching data.';
//   //     }
//   //   );
//   // }

//   totalTtlPercentage:any;

//   loadKpiScores() {
//     // Convert selectedmonths array to a comma-separated string
//     const monthsString = this.selectedmonths.join(',');
//     this.kpiScoreService.getKpiScore(this.userId, monthsString).subscribe(
//         response => {
//             if (response.status) {
//                 this.kpiScores = response.message; // Assuming message contains the data array
//                 console.log(this.kpiScores);

//                 // Calculate total TTL percentage
//                 const validTtlEntries = this.kpiScores.filter(score => score.ttl_ranking !== null).map(score => parseFloat(score.ttl_ranking));
//                 const ttlSum = validTtlEntries.reduce((sum, value) => sum + value, 0);
//                 this.totalTtlPercentage = validTtlEntries.length > 0 ? (ttlSum / validTtlEntries.length) : 0;
//             } else {
//                 this.errorMessage = response.message; // Handle error message
//             }
//         },
//         error => {
//             this.errorMessage = 'An error occurred while fetching data.';
//         }
//     );
// }



// }

import { Component, OnInit, ViewChild } from '@angular/core';
import { IonSelect } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-promoter-kpi-inner',
  templateUrl: './promoter-kpi-inner.page.html',
  styleUrls: ['./promoter-kpi-inner.page.scss'],
})
export class PromoterKpiInnerPage implements OnInit {

  @ViewChild('monthSelect') monthSelect?: IonSelect;
  selectedMonth: string | null = null;

   // Define months directly in the component
   months: Array<{ value: number, name: string }> = [
    { value: 1, name: 'January' },
    { value: 2, name: 'February' },
    { value: 3, name: 'March' },
    { value: 4, name: 'April' },
    { value: 5, name: 'May' },
    { value: 6, name: 'June' },
    { value: 7, name: 'July' },
    { value: 8, name: 'August' },
    { value: 9, name: 'September' },
    { value: 10, name: 'October' },
    { value: 11, name: 'November' },
    { value: 12, name: 'December' }
  ];

  errorMessage: string = '';
  kpiScores: any[] = [];
  selectedmonths: number[] = []; // Array to hold selected month values

  constructor(private userService:UserService,private kpiScoreService:ApiService,private authservice:AuthService) {}

  ngOnInit() {
    this.fetchUserData();
    // this.loadKpiScores();
    
  }
  ionViewWillEnter() {
    this.resetSelectedMonths();
    this.getUserRole();
  }

  roleId: string | null = null;
    lang: string | null = null;
    cid: string | null = null;
    isRoleLoaded:boolean | false = false;
    userRole:number | 0 = 0;
    // errorMessage: string | null = null;
    getUserRole() {
      const UserId = localStorage.getItem('userId');
      if (UserId) {
        this.authservice.getUserRole(UserId).subscribe({
          next: (response) => {
            if (response.status) {
              this.roleId = response.data.role_id; 
              this.userRole = response.data.role_id; 
              console.log(this.roleId);
              this.cid=response.data.region_id;
              this.lang =response.data.user_lang;
              //when get roleid then call methods

              this.isRoleLoaded = true; // ✅ now we can render
              
            } else {
              this.errorMessage = response.message; // Handle error message
              this.isRoleLoaded = true; // ✅ now we can render
            }
          },
          error: (error) => {
            console.error('API Error:', error);
            this.errorMessage = 'Failed to retrieve user role. Please try again later.';
          }
        });
      }
    }

  resetSelectedMonths() {
    this.selectedmonths = []; // Reset the selected months array
  }

  userData: any = {}; // Initialize an object to hold user data

  fetchUserData() {
    const userIdString = localStorage.getItem('userId');
    const userId = userIdString ? Number(userIdString) : null;

    if (userId !== null) {
      this.userService.fetchUserData(userId).subscribe(
        (response) => {
          if (response.status) {
            this.userData = {
              firstName: response.data.user_first_name,
              lastName: response.data.user_last_name,
              retailerName: response.data.retailer_name,
              storeName: response.data.store_name,
              categories: response.data.categories,
              country: response.data.countryname
            };
            // this.fetchIncentives();
          } else {
            this.errorMessage = 'Failed to fetch user data: ' + response.message;
            // this.isLoading = false;
          }
        },
        (error) => {
          this.errorMessage = 'Error fetching user data: ' + error.message;
          // this.isLoading = false;
        }
      );
    } else {
      this.errorMessage = 'User ID is not available.';
      // this.isLoading = false;
    }
  }


  openMonthSelect() {
    this.monthSelect?.open();
  }



  onMonthSelect(event: any) {
    const selectedValue = event.detail.value; // Get the selected month value
    this.selectedmonths = event.detail.value; // Get the array of selected month values
    console.log('Selected Months:', this.selectedmonths);
    const selectedMonthObj = this.months.find(month => month.value === selectedValue); // Find the corresponding month object
    this.selectedMonth = selectedMonthObj ? selectedMonthObj.name : null; // Update selectedMonth with the month name

    this.loadKpiScores();
  }

  // userId: number = 2893; // User ID from input
  // selectedmonths: number[] = [8, 9]; // Months from input
  

  // Method to get month name from month number
  getMonthName(monthNumber: number): string {
    const month = this.months.find(m => m.value == monthNumber);//shows undefined
    return month ? month.name : '';
  }

 

  // loadKpiScores() {
  //     // Convert selectedmonths array to a comma-separated string
  //     const monthsString = this.selectedmonths.join(',');
  //   this.kpiScoreService.getKpiScore(this.userId, monthsString).subscribe(
  //     response => {
  //       if (response.status) {
  //         this.kpiScores = response.message; // Assuming message contains the data array
  //         console.log(this.kpiScores);
  //       } else {
  //         this.errorMessage = response.message; // Handle error message
  //       }
  //     },
  //     error => {
  //       this.errorMessage = 'An error occurred while fetching data.';
  //     }
  //   );
  // }

  totalTtlPercentage:any;

  loadKpiScores() {
    // Convert selectedmonths array to a comma-separated string
    const monthsString = this.selectedmonths.join(',');
    const userIdString = localStorage.getItem('userId');
    const userId = userIdString ? Number(userIdString) : null;
    if(userId)
    this.kpiScoreService.getKpiScore(userId, monthsString).subscribe(
        response => {
            if (response.status) {
                this.kpiScores = response.message; // Assuming message contains the data array
                console.log(this.kpiScores);

                // Calculate total TTL percentage
                const validTtlEntries = this.kpiScores.filter(score => score.ttl_ranking !== null).map(score => parseFloat(score.ttl_ranking));
                const ttlSum = validTtlEntries.reduce((sum, value) => sum + value, 0);
                this.totalTtlPercentage = validTtlEntries.length > 0 ? (ttlSum / validTtlEntries.length) : 0;
            } else {
                this.errorMessage = response.message; // Handle error message
            }
        },
        error => {
            this.errorMessage = 'An error occurred while fetching data.';
        }
    );
}



}