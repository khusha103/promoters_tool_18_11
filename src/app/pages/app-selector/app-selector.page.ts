import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-app-selector',
  templateUrl: './app-selector.page.html',
  styleUrls: ['./app-selector.page.scss'],
})
export class AppSelectorPage implements OnInit {

  constructor(private router: Router) {}
  ngOnInit() {
  }

  navigateToPTA() {
    localStorage.setItem('app_selection', '1');
    this.router.navigate(['/pta-login']); 
  }

  navigateToHappy() {
    localStorage.setItem('app_selection', '2');
    this.router.navigate(['/happy-login']); 
  }

}
