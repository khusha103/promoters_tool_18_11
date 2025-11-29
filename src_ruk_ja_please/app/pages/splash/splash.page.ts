import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-splash',
  templateUrl: './splash.page.html',
  styleUrls: ['./splash.page.scss'],
})
export class SplashPage implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
    this.startTimer();
  }

  ionViewWillEnter(){
    this.startTimer();
  }

  startTimer() {
    setTimeout(async () => {
      // Check if the user is logged in
      const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

      if (isLoggedIn) {
        // Navigate to the home page if logged in
        this.router.navigate(['/home']); // Replace with your home route
      } else {
        // Navigate to the app selector if not logged in
        // this.router.navigate(['/app-selector']); // Replace with your app selector route
        this.router.navigate(['/pta-login']); 

      }
    }, 3000); // 3000 milliseconds = 3 seconds
  }

}
