// import { Component, OnInit } from '@angular/core';

// @Component({
//   selector: 'app-dropdown-outlet',
//   templateUrl: './dropdown-outlet.component.html',
//   styleUrls: ['./dropdown-outlet.component.scss'],
// })
// export class DropdownOutletComponent  implements OnInit {

//   constructor() { }

//   ngOnInit() {}

// }

import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-dropdown-outlet',
  templateUrl: './dropdown-outlet.component.html',
  styleUrls: ['./dropdown-outlet.component.scss'],
})
export class DropdownOutletComponent implements OnInit {

  @Input() outlets: any[] = []; // List of outlets passed from parent
  selectedOutlet: any;
  filteredOutlets: any[] = [];
  searchText: string = '';

  constructor(private modalController: ModalController) {}

  ngOnInit() {
    this.filteredOutlets = this.outlets; // Initialize with all outlets
  }

  filterOutlets(event: any) {
    this.searchText = event.target.value.toLowerCase();
    this.filteredOutlets = this.outlets.filter(outlet =>
      outlet.name.toLowerCase().includes(this.searchText)
    );
  }

  selectOutlet(outlet: any) {
    this.selectedOutlet = outlet;
    this.modalController.dismiss(outlet);
  }

  closeModal() {
    this.modalController.dismiss();
  }
}

