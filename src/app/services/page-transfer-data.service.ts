// import { Injectable } from '@angular/core';

// @Injectable({
//   providedIn: 'root'
// })
// export class PageTransferDataService {

//   constructor() { }
// }


import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PageTransferDataService {
  private textData = new BehaviorSubject<string>('');  // Default value
  currentTextData = this.textData.asObservable();

  constructor() {}

  // Method to set data
  setTextData(data: string) {
    this.textData.next(data);
  }
}
