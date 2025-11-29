import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService, LoginRequest,Webinar} from 'src/app/services/api.service';

@Component({
  selector: 'app-online-webniar',
  templateUrl: './online-webniar.page.html',
  styleUrls: ['./online-webniar.page.scss'],
})
export class OnlineWebniarPage implements OnInit {

  webinars: Webinar[] = [];
  userId: string = '2890';
  source: string = 'app'; // Default value, can be changed based on your logic
  message: string = '';
  header: string = '';
  content: string = '';

  constructor(private apiService:ApiService,private router:Router) { }

  ngOnInit() {
    this.loadWebinars();
  }

  loadWebinars() {
    const requestData: LoginRequest = {
      userId: this.userId,
      source: this.source
    };

    this.apiService.webinarLogin(requestData).subscribe(
      (response) => {
        if (response.status) {
          this.header = response.data.header; // Store header from response
          this.content = response.data.content; // Store content from response
          this.message = response.message;
        } else {
          this.message = response.message;
        }
      },
      (error) => {
        console.error('Error during login:', error);
        this.message = 'An error occurred while fetching webinars.';
      }
    );
  }

  acceptTerms() {
    this.apiService.acceptTerms(this.userId, this.source).subscribe(
      (response) => {
        if (response.status) {
          this.message = response.message; // Show success message
          // Optionally navigate to another page or perform other actions
          this.router.navigate(['/online-webniar-list']); 
        } else {
          this.message = response.message; // Show error message
          //error case handle here
        }
      },
      (error) => {
        console.error('Error accepting terms:', error);
        this.message = 'An error occurred while accepting terms.';
      }
    );
  }

  cancel(){
    this.router.navigate(['/home']); 
  }
}
