// import { Component, OnInit } from '@angular/core';

// @Component({
//   selector: 'app-daily-sales',
//   templateUrl: './daily-sales.page.html',
//   styleUrls: ['./daily-sales.page.scss'],
// })
// export class DailySalesPage implements OnInit {
//   roleId: number | null = null;
//   showUploadButtons: boolean = true;

//   constructor() { }

//   ngOnInit() {
//     this.getUserId();
//   }

//   getUserId() {
//     const id = localStorage.getItem('roleId');
//     this.roleId = id ? parseInt(id, 10) : null;
//     this.checkUserPermissions();
//   }

//   checkUserPermissions() {
//     if (this.roleId === 4 || this.roleId === 5 || this.roleId === 2) {
//       this.showUploadButtons = false; 
//     }
//   }
// }

import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-daily-sales',
  templateUrl: './daily-sales.page.html',
  styleUrls: ['./daily-sales.page.scss'],
})
export class DailySalesPage implements OnInit {
  roleId: number | null = null;
  showUploadButtons: boolean = true;

  constructor(private authservice:AuthService) { }

  ngOnInit() {
    // this.getUserId();
    this.getUserRole();
  }

  roleIdstring: string | null = null;
  errorMessage: string | null = null;
  getUserRole() {
    const UserId = localStorage.getItem('userId');
    if (UserId) {
      this.authservice.getUserRole(UserId).subscribe({
        next: (response) => {
          if (response.status) {
            this.roleIdstring = response.data.role_id; // Extract role_id

            //when get roleid then call methods
            this.getUserId();
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

  getUserId() {
    // const id = localStorage.getItem('roleId');
    const id = this.roleIdstring;
if(id){
  this.roleId = id ? parseInt(id, 10) : null;
  this.checkUserPermissions();
}
   
  }

  checkUserPermissions() {
    if (this.roleId === 4 || this.roleId === 5 || this.roleId === 2) {
      this.showUploadButtons = false; 
    }
  }
}