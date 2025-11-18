import { CUSTOM_ELEMENTS_SCHEMA, ErrorHandler, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';
import { FormsModule } from '@angular/forms';
import { LoadingInterceptor } from './interceptors/loading.interceptor';
import { UserService } from './services/user.service';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule,HttpClientModule,FormsModule],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy },InAppBrowser,{provide: HTTP_INTERCEPTORS, useClass: LoadingInterceptor, multi: true},UserService],
  // providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy },InAppBrowser,UserService],

  bootstrap: [AppComponent],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule {}


// import { environment } from '../environments/environment';
// import { AngularFireModule } from '@angular/fire/compat';
// import { AngularFireMessagingModule } from '@angular/fire/compat/messaging';
// import { AngularFireAuthModule } from '@angular/fire/compat/auth';


// @NgModule({
//   declarations: [AppComponent],
//   imports: [
//     BrowserModule, 
//     IonicModule.forRoot(), 
//     AppRoutingModule, 
//     HttpClientModule, 
//     IonicStorageModule.forRoot(),
//     AngularFireModule.initializeApp(environment.firebaseConfig),
//     AngularFireMessagingModule,
//     AngularFireAuthModule,
    
//   ],
//   providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
//   bootstrap: [AppComponent],
// })
// export class AppModule {}
