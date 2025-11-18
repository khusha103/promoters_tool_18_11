// import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Injectable, ErrorHandler, Injector } from '@angular/core';
import { Router } from '@angular/router';
import { Capacitor } from '@capacitor/core';
import { Toast } from '@capacitor/toast';
// import { HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
// export class GlobalErrorHandlerService {
  export class GlobalErrorHandlerService implements ErrorHandler {

    constructor(private injector: Injector,private router : Router) {}

    // handleError(error: any): void {
    //   // Custom error handling logic
    //   console.error('Global Error:', error);
    //   console.log("Error hai bhai");
    //   // Rethrow the error or perform additional actions
    //   throw error;
    // }

  // Method to check if the error is valid and return a boolean
  checkError(error: any): boolean {
    return error instanceof Error; // Return true if it's a standard Error object
  }
  
  handleError(error: Error | HttpErrorResponse) {
    console.error('An error occurred:', error);
  
    if (error instanceof HttpErrorResponse) {
      // Check if the error is a server unavailable error (503)
      if (error.status === 503) {
        if (Capacitor.isNativePlatform()) {
          // Handle native platform errors
          this.showNativeError(error);
        } else {
          // Handle web errors
          this.showWebError(error);
        }
  
        // Navigate to the server down page
        this.router.navigate(['/server-down']);
      } else {
        // Handle other HTTP errors if needed
        // this.showWebError(error); or any other logic
      }
    } else {
      // Handle non-HTTP errors (client-side or network errors)
      // this.showWebError(error); or any other logic
    }
  }
  
  
    // private async showNativeError(error: Error | HttpErrorResponse) {
    //   await Toast.show({
    //     text: 'An error occurred. Please try again later.',
    //     duration: 'long',
    //     position: 'bottom'
    //   });
    // }
  
    // private showWebError(error: Error | HttpErrorResponse) {
    //   // Implement web-specific error handling here
    //   // For example, you could use a toast library or custom modal
    //   console.log('Web error:', error.message);
    // }



    private async showNativeError(error: Error | HttpErrorResponse) {
      console.log('native error:', error.message);
      try {
        await Toast.show({
          text: 'An error occurred. Please try again later.',
          duration: 'long',
          position: 'bottom'
        });
      } catch (toastError) {
        console.error('Failed to show native toast:', toastError);
        // Fallback to alert if toast fails
        alert('An error occurred. Please try again later.');
      }
    }
  
    private showWebError(error: Error | HttpErrorResponse) {
      // Implement web-specific error handling here
      console.log('Web error:', error.message);
      // alert('An error occurred. Please check the console for more details.');
    }
}
