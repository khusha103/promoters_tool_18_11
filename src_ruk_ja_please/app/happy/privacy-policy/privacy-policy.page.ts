import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';

@Component({
  selector: 'app-privacy-policy',
  templateUrl: './privacy-policy.page.html',
  styleUrls: ['./privacy-policy.page.scss'],
})
export class PrivacyPolicyPage {
  constructor(private iab: InAppBrowser, private router: Router) {}

  // openPrivacyPolicy() {
  //   // Open the Privacy Policy URL in the In-App Browser
  //   this.iab.create('https://www.sony-mea.com/microsite/privacypolicy/en', '_blank'); // Replace with your actual URL
  // }


  openPrivacyPolicy() {
    const browser = this.iab.create('https://www.sony-mea.com/microsite/privacypolicy/en', '_blank', {
      hidden: 'no',
      hardwareback: 'yes',
      fullscreen: 'no'
    });
  }
  // acceptPolicy() {
  //   console.log('Privacy Policy Accepted');
  //   // Handle acceptance (e.g., navigate to the home page)
  //   this.router.navigate(['/home']); // Change to your desired route
  // }
}
