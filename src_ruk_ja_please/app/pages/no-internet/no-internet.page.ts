import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NetworkService } from 'src/app/services/network.service';


@Component({
  selector: 'app-no-internet',
  templateUrl: './no-internet.page.html',
  styleUrls: ['./no-internet.page.scss'],
})
export class NoInternetPage implements OnInit {

  constructor(private router: Router, private networkService: NetworkService) {}

  ngOnInit() {
    // You can add any initialization logic here if needed
  }

  async reloadApp() {
    const isConnected = await this.networkService.checkNetwork();
    if (isConnected) {
      this.router.navigate(['/splash']); 
    } else {
      alert('Still no internet connection. Please check your network settings.');
    }
  }

  
}