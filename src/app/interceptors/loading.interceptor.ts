import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { LoadingController } from '@ionic/angular';

@Injectable()
export class LoadingInterceptor implements HttpInterceptor {
  private activeRequests = 0;
  private loader!: HTMLIonLoadingElement;

  private messages: string[] = [
    'Please wait...',
    'Processing your request...',
    'Fetching data...',
    'Synchronizing information...',
    'Optimizing performance...',
    'Loading resources...',
    'Preparing data for you...'
  ];

  constructor(private loadingCtrl: LoadingController) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (this.activeRequests === 0) {
      this.showLoader();
    }

    this.activeRequests++;

    return next.handle(request).pipe(
      finalize(() => {
        this.activeRequests--;
        if (this.activeRequests === 0) {
          this.hideLoader();
        }
      })
    );
  }

  private async showLoader() {
    console.log("show loader");
    const message = this.getRandomMessage();
    this.loader = await this.loadingCtrl.create({
      // message: 'Loading...',
      message: message,
      spinner: 'circles',
      cssClass: 'sony-promoters-loader',
      backdropDismiss: false,
      translucent: true
    });
    await this.loader.present();
  }

  private hideLoader() {
    console.log("hide loader");
    if (this.loader) {
      this.loader.dismiss();
    }
  }

  private getRandomMessage(): string {
    return this.messages[Math.floor(Math.random() * this.messages.length)];
  }
}