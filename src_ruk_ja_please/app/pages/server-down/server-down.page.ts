import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GlobalErrorHandlerService } from 'src/app/services/global-error-handler.service';
import { NetworkService } from 'src/app/services/network.service';

@Component({
  selector: 'app-server-down',
  templateUrl: './server-down.page.html',
  styleUrls: ['./server-down.page.scss'],
})
export class ServerDownPage implements OnInit {

  constructor(private router: Router,
    private errorHandler: GlobalErrorHandlerService,
    private networkService: NetworkService) { }

  ngOnInit() {
  }

  async reloadApp() {
    try {
      // Simulate checking for an error condition
      const error = await this.checkForError(); 

      // Use the error handler to check if an error exists
      const isError = this.errorHandler.checkError(error);

      if (isError) {
        // If an error exists, navigate to the server-down page
        this.router.navigate(['/server-down']);
      } else {
        // No error, navigate to the splash page
        this.router.navigate(['/splash']);
      }
    } catch (error) {
      // Handle any unexpected errors
      await this.errorHandler.handleError(error as Error | HttpErrorResponse);
    }
  }

  // Example method to simulate error checking
  private async checkForError(): Promise<Error | null> {
    return null; 
  }
}
