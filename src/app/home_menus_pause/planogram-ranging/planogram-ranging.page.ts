import { Component, OnInit } from '@angular/core';

import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-planogram-ranging',
  templateUrl: './planogram-ranging.page.html',
  styleUrls: ['./planogram-ranging.page.scss'],
})
export class PlanogramRangingPage implements OnInit {
  usertype: string = "";
  permissions: any = {};  // To store permissions fetched from the API

  constructor(private permissionsService: ApiService,private authservice:AuthService) { }

  ngOnInit() {
    // Check the value in local storage
    const appSelector = localStorage.getItem('app_selection');
    
    // Conditional assignment based on app-selection value
    this.usertype = appSelector === '1' ? "1" : "2"; 
    
    // Fetch permissions from the API
    // this.getPermissions();
    this.getUserRole();
  }

  roleId: string | null = null;
    lang: string | null = null;
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
              this.lang =response.data.user_lang;
              //when get roleid then call methods
              this.getPermissions();
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


  getPermissions() {
    // const userRoleId = 1;  //will update when user login role assignment is done
    // const userRoleId = Number(localStorage.getItem('roleId'));
    const userRoleId = Number(this.roleId);

    
    this.permissionsService.getPermissions(userRoleId).subscribe(response => {
      if (response.status) {
        this.permissions = response.data[0];
        // console.log(this.permissions);
      } else {
        console.error("No permissions found");
      }
    }, error => {
      console.error("Error fetching permissions", error);
    });
  }
}
