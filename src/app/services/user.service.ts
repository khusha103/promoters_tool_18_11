import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, tap, of } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  // private apiUrl = 'https://ekarigartech.com/erp/App_api'; // Replace with your API URL
  // private apiUrl = 'https://ekarigartech.com/happy_pta/App_api'; // Replace with your API URL
  private apiUrl = `${environment.apiBaseUrl}/App_api`; // Replace with your API URL

  public userData: any; // Global variable to store user data

  constructor(private http: HttpClient) {}

  // Method to get user relevant data
  getUserRelevantData(userId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/relevant_data/${userId}`);
  }


  // Method to get user relevant data
  getUsertableData(userId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/getUsersbyId/${userId}`);
  }

  // Method to fetch and store user data
  fetchUserData(userId: number): Observable<any> {
    // const roleId = localStorage.getItem('roleId'); // Retrieve roleId from local storage

    // // Check if roleId is '1' (superadmin)
    // if (roleId === '1') {
    //   console.log('Superadmin detected. Skipping fetching relevant user data.');
    //   return of(null); // Return an observable with null or empty data
    // }

    return this.getUserRelevantData(userId).pipe(
      tap((response: { status: any; data: any; message: any; }) => {
        if (response.status) {
          this.userData = response.data; // Store data in global variable
        } else {
          console.error(response.message);
        }
      }),
      catchError((error: any) => {
        console.error('Error fetching user data:', error);
        throw error; // Rethrow the error for further handling
      })
    );
  }


  // Method to fetch and store user data
  fetchUsertableData(userId: number): Observable<any> {
    // const roleId = localStorage.getItem('roleId'); // Retrieve roleId from local storage

    // // Check if roleId is '1' (superadmin)
    // if (roleId === '1') {
    //   console.log('Superadmin detected. Skipping fetching relevant user data.');
    //   return of(null); // Return an observable with null or empty data
    // }

    return this.getUsertableData(userId).pipe(
      tap((response: { status: any; data: any; message: any; }) => {
        if (response.status) {
          this.userData = response.data; // Store data in global variable
        } else {
          console.error(response.message);
        }
      }),
      catchError((error: any) => {
        console.error('Error fetching user data:', error);
        throw error; // Rethrow the error for further handling
      })
    );
  }
}