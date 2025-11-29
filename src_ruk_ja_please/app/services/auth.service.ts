import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // constructor() { }


  constructor(private http: HttpClient) {}
  // private apiUrl = 'https://ekarigartech.com/erp/Aauth_api'; 
  // private erpapiUrl = 'https://ekarigartech.com/erp/App_api'; 

  // private apiUrl = 'https://ekarigartech.com/happy_pta/Aauth_api'; 
  // private erpapiUrl = 'https://ekarigartech.com/happy_pta/App_api'; 

  // private happyapiUrl = 'https://ekarigartech.com/happy/App_api'; 

  private apiUrl = `${environment.apiBaseUrl}/Aauth_api`; 
  private erpapiUrl = `${environment.apiBaseUrl}/App_api`; 

  private happyapiUrl = `${environment.apiBaseUrl}/App_api`; 


  // login(username: string, password: string, deviceInfo: any): Observable<any> {
  //   const headers = new HttpHeaders({
  //     'Content-Type': 'application/json',
  //     'X-DEVICE-ID': deviceInfo.deviceId,
  //     'X-DEVICE-TYPE': deviceInfo.deviceType,
  //     'X-DEVICE-OS-V': deviceInfo.osVersion,
  //     'X-DEVICE-OS': deviceInfo.os
  //   });

  //   const body = JSON.stringify({ username, password });

  //   return this.http.post(`${this.apiUrl}/login`, body, { headers });
  // }


  getUserRole(userId: string): Observable<any> {
    const url = `${this.erpapiUrl}/userole`; // Adjust endpoint if needed
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    const body = { user_id: userId };

    return this.http.post(url, body, { headers });
  }

  login(username: string, password: string, token:any, deviceInfo: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'X-DEVICE-ID': deviceInfo.deviceId,
      'X-DEVICE-TYPE': deviceInfo.deviceType,
      'X-DEVICE-OS-V': deviceInfo.osVersion,
      'X-DEVICE-OS': deviceInfo.os,
      'X-DEVICE-MODEL' :deviceInfo.model
    });

    const body = JSON.stringify({ username, password, token });

    return this.http.post(`${this.apiUrl}/login`, body, { headers });
  }




//  happy project not use after login merge

happylogin(username: string, password: string, deviceInfo: any): Observable<any> {

  const headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'X-DEVICE-ID': deviceInfo.deviceId,
    'X-DEVICE-TYPE': deviceInfo.deviceType,
    'X-DEVICE-OS-V': deviceInfo.osVersion,
    'X-DEVICE-OS': deviceInfo.os,
    'X-DEVICE-UUID': deviceInfo.uuid,
    'X-DEVICE-DEVICENAME' : deviceInfo.deviceName
  });

  const body = { username, password };
  return this.http.post<any>(`${this.happyapiUrl}/login`, body, { headers });
}

// options(): Observable<void> {
//   return this.http.options(this.apiUrl);
// }


saveAttendance(userId: string, actionId: number, comment: string, locLatitude: number, locLongitude: number): Observable<any> {
  const postData = {
    user_id: userId,
    action_id: actionId,
    loc_latitude: locLatitude,
    loc_longitude: locLongitude,
    comment: comment
  };

  return this.http.post(`${this.apiUrl}/attendance`, postData);
}


// In your auth.service.ts
getUserTermsStatus(userId: number): Observable<any> {
  return this.http.get(`${this.apiUrl}/getTermsStatus/${userId}`); // Adjust the URL as needed
}

getdetails(userId: number, deviceInformation: any): Observable<any> {

  const url = `${this.erpapiUrl}/getUserDeviceDetails/${userId}/${deviceInformation.deviceId}`;
  console.log("urlof" ,url);
  
  return this.http.get<any>(url);
}






}
