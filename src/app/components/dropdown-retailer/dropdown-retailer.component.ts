// import { Component, OnInit } from '@angular/core';

// @Component({
//   selector: 'app-dropdown-retailer',
//   templateUrl: './dropdown-retailer.component.html',
//   styleUrls: ['./dropdown-retailer.component.scss'],
// })
// export class DropdownRetailerComponent  implements OnInit {

//   constructor() { }

//   ngOnInit() {}

// }

import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-dropdown-retailer',
  templateUrl: './dropdown-retailer.component.html',
  styleUrls: ['./dropdown-retailer.component.scss'],
})
export class DropdownRetailerComponent implements OnInit {

  @Input() retailers: any[] = []; // Input for the list of retailers passed from the parent component
  selectedRetailer: any; // Property to track the selected retailer
  filteredRetailers: any[] = [];
  searchText: string = '';

  constructor(private modalController: ModalController) {}

  ngOnInit() {
    this.filteredRetailers = this.retailers; // Initialize filtered list with all retailers
  }

  filterRetailers(event: any) {
    this.searchText = event.target.value.toLowerCase();
    this.filteredRetailers = this.retailers.filter(retailer =>
      retailer.name.toLowerCase().includes(this.searchText)
    );
  }

  selectRetailer(retailer: any) {
    this.selectedRetailer = retailer;
    this.modalController.dismiss(retailer);
  }

  closeModal() {
    this.modalController.dismiss();
  }
}


