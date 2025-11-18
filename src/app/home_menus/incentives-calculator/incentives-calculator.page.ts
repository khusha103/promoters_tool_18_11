// // import { Component, OnInit } from '@angular/core';
// // import { ApiService } from 'src/app/services/api.service';
// // import { UserService } from 'src/app/services/user.service';

// // @Component({
// //   selector: 'app-incentives-calculator',
// //   templateUrl: './incentives-calculator.page.html',
// //   styleUrls: ['./incentives-calculator.page.scss'],
// // })
// // export class IncentivesCalculatorPage implements OnInit {

// //   constructor(private userService: UserService,private apiService:ApiService) { }
// //   currentMonthName!: string;
// //   currentMonthDays!: number;
// //   daysPassed!: number;
// //   daysLeft!: number;
// //   total_of_incentive_amount!: number;

// //   limit_total!:number;
// //   uncaped_total!:number;


// //   incentiveData: any;
// //   incentivePPIData:any;
// //   errorMessage: string = '';
// //   ngOnInit() {
// //     this.fetchUserData();
// //     this.updateMonthData();
  
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
// //             this.fetchIncentives();
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

// //   updateMonthData() {
// //     const currentDate = new Date();
// //     this.currentMonthName = currentDate.toLocaleString('default', { month: 'long' });

// //     const currentYear = currentDate.getFullYear();
// //     const currentMonth = currentDate.getMonth() + 1;
// //     const daysInMonth = new Date(currentYear, currentMonth, 0).getDate();

// //     this.currentMonthDays = daysInMonth;
// //     this.daysPassed = currentDate.getDate();
// //     this.daysLeft = daysInMonth - this.daysPassed;
// //   }



// //   // fetchIncentives() {
// //   //   const userIdString = localStorage.getItem('userId');
// //   //     // const userId = userIdString ? Number(userIdString) : null;
// //   //     const userId = 1660;
// //   //   if (userId !== null) {
// //   //     this.apiService.calculateIncentive(userId).subscribe(
// //   //       (response) => {
// //   //         if (response.status) {
// //   //           this.incentiveData = response.message;
// //   //           this.fetchIncentivesFromPPI();
// //   //         } else {
// //   //           this.errorMessage = response.message;
// //   //         }
// //   //       },
// //   //       (error) => {
// //   //         console.error('Error fetching incentives:', error);
// //   //         this.errorMessage = 'An error occurred while fetching incentives.';
// //   //       }
// //   //     );
// //   //   } else {
// //   //     this.errorMessage = 'User ID is required.';
// //   //   }
// //   // }

// //   // fetchIncentivesFromPPI() {
// //   //   // const userId = localStorage.getItem('userId') ? Number(localStorage.getItem('userId')) : null;
// //   //   const userId = 1660;

// //   //   if (userId !== null) {
// //   //     this.apiService.calculateIncentiveFromPPI(userId).subscribe(
// //   //       (response) => {
// //   //         if (response.status) {
// //   //           this.incentivePPIData = response.message; // This will be an object
// //   //           // Convert to number before adding to avoid string concatenation
// //   //           this.total_of_incentive_amount = Number(response.message.total_of_incentive_amount) + Number(response.message['0'].grand_total);
// //   //           console.log(this.total_of_incentive_amount);
// //   //         } else {
// //   //           this.errorMessage = response.message;
// //   //         }
// //   //       },
// //   //       (error) => {
// //   //         console.error('Error fetching incentives from PPI:', error);
// //   //         this.errorMessage = 'An error occurred while fetching incentives from PPI.';
// //   //       }
// //   //     );
// //   //   } else {
// //   //     this.errorMessage = 'User ID is required.';
// //   //   }
// //   // }

// //   // // Method to get keys for iterating over the incentive data
// //   // getIncentiveKeys() {
// //   //   return Object.keys(this.incentivePPIData).filter(key => !isNaN(Number(key))); // Filter numeric keys
// //   // }


// //   fetchIncentives() {
// //     const userId = localStorage.getItem('userId') ? Number(localStorage.getItem('userId')) : null;
// //     // const userId = 2892; 
// //     if (userId !== null) {
// //     this.apiService.calculateIncentive(userId).subscribe(
// //       (response) => {
// //         if (response.status) {
// //           this.incentiveData = response.message;
// //           this.fetchIncentivesFromPPI();
// //         } else {
// //           this.errorMessage = response.message;
// //           // this.isLoading = false;
// //         }
// //       },
// //       (error) => {
// //         this.errorMessage = 'Error fetching incentives: ' + error.message;
// //         // this.isLoading = false;
// //       }
// //     );
// //   }
// //   }

// //   fetchIncentivesFromPPI() {
// //     const userId = localStorage.getItem('userId') ? Number(localStorage.getItem('userId')) : null;
// //     // const userId = 2892; 

// //     if (userId !== null) {
// //     this.apiService.calculateIncentiveFromPPI(userId).subscribe(
// //       (response) => {
// //         if (response.status) {
// //           console.log(response);
// //           this.incentivePPIData = response.message || {};
// //           // this.total_of_incentive_amount = Number(response.message?.total_of_incentive_amount || 0) + 
// //           //                                  Number(response.message?.['0']?.grand_total || 0);
// //           this.total_of_incentive_amount = Number(response.message?.total_of_incentive_amount || 0);
// //           this.limit_total = Number(response.message?.limit_total || 0);
// //           this.uncaped_total = Number(response.message?.uncaped_total || 0);
// //         } else {
// //           this.errorMessage = response.message;
// //         }
// //         // this.isLoading = false;
// //       },
// //       (error) => {
// //         this.errorMessage = 'Error fetching incentives from PPI: ' + error.message;
// //         // this.isLoading = false;
// //       }
// //     );
// //   }
// //   }

// //   getIncentiveKeys(): string[] {
// //     return this.incentivePPIData ? 
// //            Object.keys(this.incentivePPIData).filter(key => !isNaN(Number(key))) : 
// //            [];
// //   }




// // }

// import { Component, OnInit } from '@angular/core';
// import { ApiService } from 'src/app/services/api.service';
// import { AuthService } from 'src/app/services/auth.service';
// import { UserService } from 'src/app/services/user.service';

// @Component({
//   selector: 'app-incentives-calculator',
//   templateUrl: './incentives-calculator.page.html',
//   styleUrls: ['./incentives-calculator.page.scss'],
// })
// export class IncentivesCalculatorPage implements OnInit {

//   constructor(private userService: UserService,private apiService:ApiService,private authservice:AuthService) { }
//   currentMonthName!: string;
//   currentMonthDays!: number;
//   daysPassed!: number;
//   daysLeft!: number;
//   total_of_incentive_amount!: number;

//   limit_total!:number;
//   uncaped_total!:number;


//   incentiveData: any;
//   incentivePPIData:any;
//   errorMessage: string = '';
//   ngOnInit() {
//     this.fetchUserData();
//     this.updateMonthData();
//     this.getUserRole();
  
//   }

//   roleId: string | null = null;
//     lang: string | null = null;
//     cid: string | null = null;
//     userRole:Number | null = null;
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
//             this.fetchIncentives();
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

//   updateMonthData() {
//     const currentDate = new Date();
//     this.currentMonthName = currentDate.toLocaleString('default', { month: 'long' });

//     const currentYear = currentDate.getFullYear();
//     const currentMonth = currentDate.getMonth() + 1;
//     const daysInMonth = new Date(currentYear, currentMonth, 0).getDate();

//     this.currentMonthDays = daysInMonth;
//     this.daysPassed = currentDate.getDate();
//     this.daysLeft = daysInMonth - this.daysPassed;
//   }



//   // fetchIncentives() {
//   //   const userIdString = localStorage.getItem('userId');
//   //     // const userId = userIdString ? Number(userIdString) : null;
//   //     const userId = 1660;
//   //   if (userId !== null) {
//   //     this.apiService.calculateIncentive(userId).subscribe(
//   //       (response) => {
//   //         if (response.status) {
//   //           this.incentiveData = response.message;
//   //           this.fetchIncentivesFromPPI();
//   //         } else {
//   //           this.errorMessage = response.message;
//   //         }
//   //       },
//   //       (error) => {
//   //         console.error('Error fetching incentives:', error);
//   //         this.errorMessage = 'An error occurred while fetching incentives.';
//   //       }
//   //     );
//   //   } else {
//   //     this.errorMessage = 'User ID is required.';
//   //   }
//   // }

//   // fetchIncentivesFromPPI() {
//   //   // const userId = localStorage.getItem('userId') ? Number(localStorage.getItem('userId')) : null;
//   //   const userId = 1660;

//   //   if (userId !== null) {
//   //     this.apiService.calculateIncentiveFromPPI(userId).subscribe(
//   //       (response) => {
//   //         if (response.status) {
//   //           this.incentivePPIData = response.message; // This will be an object
//   //           // Convert to number before adding to avoid string concatenation
//   //           this.total_of_incentive_amount = Number(response.message.total_of_incentive_amount) + Number(response.message['0'].grand_total);
//   //           console.log(this.total_of_incentive_amount);
//   //         } else {
//   //           this.errorMessage = response.message;
//   //         }
//   //       },
//   //       (error) => {
//   //         console.error('Error fetching incentives from PPI:', error);
//   //         this.errorMessage = 'An error occurred while fetching incentives from PPI.';
//   //       }
//   //     );
//   //   } else {
//   //     this.errorMessage = 'User ID is required.';
//   //   }
//   // }

//   // // Method to get keys for iterating over the incentive data
//   // getIncentiveKeys() {
//   //   return Object.keys(this.incentivePPIData).filter(key => !isNaN(Number(key))); // Filter numeric keys
//   // }


//   fetchIncentives() {
//     const userId = localStorage.getItem('userId') ? Number(localStorage.getItem('userId')) : null;
//     // const userId = 2892; 
//     if (userId !== null) {
//     this.apiService.calculateIncentive(userId).subscribe(
//       (response) => {
//         if (response.status) {
//           this.incentiveData = response.message;
//           this.fetchIncentivesFromPPI();
//         } else {
//           this.errorMessage = response.message;
//           // this.isLoading = false;
//         }
//       },
//       (error) => {
//         this.errorMessage = 'Error fetching incentives: ';
//         // this.isLoading = false;
//       }
//     );
//   }
//   }

//   fetchIncentivesFromPPI() {
//     const userId = localStorage.getItem('userId') ? Number(localStorage.getItem('userId')) : null;
//     // const userId = 2892; 

//     if (userId !== null) {
//     this.apiService.calculateIncentiveFromPPI(userId).subscribe(
//       (response) => {
//         if (response.status) {
//           console.log(response);
//           this.incentivePPIData = response.message || {};
//           // this.total_of_incentive_amount = Number(response.message?.total_of_incentive_amount || 0) + 
//           //                                  Number(response.message?.['0']?.grand_total || 0);
//           this.total_of_incentive_amount = Number(response.message?.total_of_incentive_amount || 0);
//           this.limit_total = Number(response.message?.limit_total || 0);
//           this.uncaped_total = Number(response.message?.uncaped_total || 0);
//         } else {
//           this.errorMessage = response.message;
//         }
//         // this.isLoading = false;
//       },
//       (error) => {
//         this.errorMessage = 'Error fetching incentives from PPI: ';
//         // this.isLoading = false;
//       }
//     );
//   }
//   }

//   getIncentiveKeys(): string[] {
//     return this.incentivePPIData ? 
//            Object.keys(this.incentivePPIData).filter(key => !isNaN(Number(key))) : 
//            [];
//   }




// }

import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-incentives-calculator',
  templateUrl: './incentives-calculator.page.html',
  styleUrls: ['./incentives-calculator.page.scss'],
})
export class IncentivesCalculatorPage implements OnInit {

  constructor(private userService: UserService,private apiService:ApiService,private authservice:AuthService) { }
  currentMonthName!: string;
  currentMonthDays!: number;
  daysPassed!: number;
  daysLeft!: number;
  total_of_incentive_amount!: number;

  limit_total!:number;
  uncaped_total!:number;


  incentiveData: any;
  incentivePPIData:any;
  errorMessage: string = '';
  ngOnInit() {
    this.fetchUserData();
    this.updateMonthData();
    this.getUserRole();
  
  }

  roleId: string | null = null;
    lang: string | null = null;
    cid: string | null = null;
    user_cat: string | null = null;
    isRoleLoaded: boolean | null = null;

    userRole:Number | null = null;
    // errorMessage: string | null = null;
    getUserRole() {
      const UserId = localStorage.getItem('userId');
      if (UserId) {
        this.authservice.getUserRole(UserId).subscribe({
          // next: (response) => {
          //   if (response.status) {
          //     this.roleId = response.data.role_id; 
          //     this.userRole = response.data.role_id; 
          //     console.log(this.roleId);
          //     this.cid=response.data.region_id;
          //     this.lang =response.data.user_lang;
          //     this.user_cat = response.data.category_ids;
          //     //when get roleid then call methods

          //     this.get_sloganData();
             
          //   } else {
          //     this.errorMessage = response.message; // Handle error message
          //   }
          // },

          next: (response) => {
            if (response.status) {
              this.roleId = response.data.role_id;
              this.userRole = response.data.role_id;
              this.cid = response.data.region_id;
              this.lang = response.data.user_lang;
              this.user_cat = response.data.category_ids;
          
              this.get_sloganData();
          
              this.isRoleLoaded = true; // ✅ now we can render
            } else {
              this.errorMessage = response.message;
              this.isRoleLoaded = true; // still mark as loaded to avoid infinite loading
            }
          },
          
          error: (error) => {
            console.error('API Error:', error);
            this.errorMessage = 'Failed to retrieve user role. Please try again later.';
          }
        });
      }
    }

    

    // const payload = {
    //   country_id: this.cid,         // your region_id from user data
    //   category_id: this.user_cat    // your category_ids from user data
    // };

    // get_setData(){
    //   this.apiService.getslogansData('get_api_title_for_app', payload).subscribe({
    //     next: (response) => {
    //       console.log('API Response:', response);
    //       // handle the response here
    //     },
    //     error: (error) => {
    //       console.error('API Error:', error);
    //     }
    //   }
    // });

    slogans: any[] = [];

    get_sloganData() {
      const payload = {
        country_id: this.cid,   
        // country_id: 1,          // Make sure this is set from getUserRole()
        category_id: this.user_cat     // Should be an array or number based on API
      };

      
    
      this.apiService.getslogansData('get_api_title_for_app', payload).subscribe({
        next: (response) => {
          console.log('API Response:', response);
          // handle the response here

          console.log('API Response:', response);
          if (response.status && Array.isArray(response.message)) {
            this.slogans = response.message;
            this.formatSlogans();
          }
        },
        error: (error) => {
          console.error('API Error:', error);
        }
      });
    }


    categoryMap: any = {
      '1': 'TV',
      '2': 'DI',
      '3': 'MA',
      '4': 'HAV'
    };
    
    displayLines: string[] = [];

    formatSlogans() {
  const payload = {
    country_id: this.cid,
    // country_id: 1,
    category_id: this.user_cat
  };

  this.apiService.getslogansData('get_api_title_for_app', payload).subscribe({
    next: (response) => {
      if (response.status) {
        this.displayLines = response.message.map((item: any) => {
          const categoryName = this.categoryMap[item.category_id] || 'Unknown';
          return `${categoryName} : ${item.title} `;
        });

        console.log(this.displayLines);
      }
    },
    error: (error) => {
      console.error('API Error:', error);
    }
  });
}

    

    // groupByCategory(slogans: any[]) {
    //   const grouped: any = {};
    //   slogans.forEach(item => {
    //     if (!grouped[item.category_id]) {
    //       grouped[item.category_id] = [];
    //     }
    //     grouped[item.category_id].push(item);
    //   });
    
    //   return Object.keys(grouped).map(category_id => ({
    //     category_id,
    //     items: grouped[category_id]
    //   }));
    // }
    
    

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
            this.fetchIncentives();
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

  updateMonthData() {
    const currentDate = new Date();
    this.currentMonthName = currentDate.toLocaleString('default', { month: 'long' });

    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;
    const daysInMonth = new Date(currentYear, currentMonth, 0).getDate();

    this.currentMonthDays = daysInMonth;
    this.daysPassed = currentDate.getDate();
    this.daysLeft = daysInMonth - this.daysPassed;
  }



  // fetchIncentives() {
  //   const userIdString = localStorage.getItem('userId');
  //     // const userId = userIdString ? Number(userIdString) : null;
  //     const userId = 1660;
  //   if (userId !== null) {
  //     this.apiService.calculateIncentive(userId).subscribe(
  //       (response) => {
  //         if (response.status) {
  //           this.incentiveData = response.message;
  //           this.fetchIncentivesFromPPI();
  //         } else {
  //           this.errorMessage = response.message;
  //         }
  //       },
  //       (error) => {
  //         console.error('Error fetching incentives:', error);
  //         this.errorMessage = 'An error occurred while fetching incentives.';
  //       }
  //     );
  //   } else {
  //     this.errorMessage = 'User ID is required.';
  //   }
  // }

  // fetchIncentivesFromPPI() {
  //   // const userId = localStorage.getItem('userId') ? Number(localStorage.getItem('userId')) : null;
  //   const userId = 1660;

  //   if (userId !== null) {
  //     this.apiService.calculateIncentiveFromPPI(userId).subscribe(
  //       (response) => {
  //         if (response.status) {
  //           this.incentivePPIData = response.message; // This will be an object
  //           // Convert to number before adding to avoid string concatenation
  //           this.total_of_incentive_amount = Number(response.message.total_of_incentive_amount) + Number(response.message['0'].grand_total);
  //           console.log(this.total_of_incentive_amount);
  //         } else {
  //           this.errorMessage = response.message;
  //         }
  //       },
  //       (error) => {
  //         console.error('Error fetching incentives from PPI:', error);
  //         this.errorMessage = 'An error occurred while fetching incentives from PPI.';
  //       }
  //     );
  //   } else {
  //     this.errorMessage = 'User ID is required.';
  //   }
  // }

  // // Method to get keys for iterating over the incentive data
  // getIncentiveKeys() {
  //   return Object.keys(this.incentivePPIData).filter(key => !isNaN(Number(key))); // Filter numeric keys
  // }


  fetchIncentives() {
    const userId = localStorage.getItem('userId') ? Number(localStorage.getItem('userId')) : null;
    // const userId = 2892; 
    if (userId !== null) {
    this.apiService.calculateIncentive(userId).subscribe(
      (response) => {
        if (response.status) {
          this.incentiveData = response.message;
          this.fetchIncentivesFromPPI();
        } else {
          this.errorMessage = response.message;
          // this.isLoading = false;
        }
      },
      (error) => {
        this.errorMessage = 'Error fetching incentives: ';
        // this.isLoading = false;
      }
    );
  }
  }

  fetchIncentivesFromPPI() {
    const userId = localStorage.getItem('userId') ? Number(localStorage.getItem('userId')) : null;
    // const userId = 2892; 

    if (userId !== null) {
    this.apiService.calculateIncentiveFromPPI(userId).subscribe(
      (response) => {
        if (response.status) {
          console.log(response);
          this.incentivePPIData = response.message || {};
          // this.total_of_incentive_amount = Number(response.message?.total_of_incentive_amount || 0) + 
          //                                  Number(response.message?.['0']?.grand_total || 0);
          this.total_of_incentive_amount = Number(response.message?.total_of_incentive_amount || 0);
          this.limit_total = Number(response.message?.limit_total || 0);
          this.uncaped_total = Number(response.message?.uncaped_total || 0);
        } else {
          this.errorMessage = response.message;
        }
        // this.isLoading = false;
      },
      (error) => {
        this.errorMessage = 'Error fetching incentives from PPI: ';
        // this.isLoading = false;
      }
    );
  }
  }

  getIncentiveKeys(): string[] {
    return this.incentivePPIData ? 
           Object.keys(this.incentivePPIData).filter(key => !isNaN(Number(key))) : 
           [];
  }




}
