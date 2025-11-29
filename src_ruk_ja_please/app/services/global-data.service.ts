import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GlobalDataService {

  constructor() { }


  private apiResultSubject = new BehaviorSubject<any>(null);
  
  setApiResult(data: any) {
    this.apiResultSubject.next(data);
  }

  getApiResult() {
    return this.apiResultSubject.asObservable();
  }
}
