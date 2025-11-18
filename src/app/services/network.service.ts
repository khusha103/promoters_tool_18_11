import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Network } from '@capacitor/network';

@Injectable({
  providedIn: 'root'
})
export class NetworkService {

  // constructor() { }

  constructor(private router: Router) {
    this.initializeNetworkEvents();
  }

  private async initializeNetworkEvents() {
    Network.addListener('networkStatusChange', (status) => {
      console.log('Network status changed', status);
      if (!status.connected) {
        this.router.navigate(['/no-internet']);
      }
    });

    const status = await Network.getStatus();
    if (!status.connected) {
      this.router.navigate(['/no-internet']);
    }
  }

  async checkNetwork() {
    const status = await Network.getStatus();
    return status.connected;
  }
}
