// import { Component, OnInit } from '@angular/core';

// @Component({
//   selector: 'app-dropdown-promoter',
//   templateUrl: './dropdown-promoter.component.html',
//   styleUrls: ['./dropdown-promoter.component.scss'],
// })
// export class DropdownPromoterComponent  implements OnInit {

//   constructor() { }

//   ngOnInit() {}

// }


import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-dropdown-promoter',
  templateUrl: './dropdown-promoter.component.html',
  styleUrls: ['./dropdown-promoter.component.scss'],
})
export class DropdownPromoterComponent implements OnInit {

  @Input() promoters: any[] = []; // List of promoters passed from parent
  selectedPromoter: any;
  filteredPromoters: any[] = [];
  searchText: string = '';

  constructor(private modalController: ModalController) {}

  ngOnInit() {
    this.filteredPromoters = this.promoters; // Initialize with all promoters
  }

  filterPromoters(event: any) {
    this.searchText = event.target.value.toLowerCase();
    this.filteredPromoters = this.promoters.filter(promoter =>
      promoter.name.toLowerCase().includes(this.searchText)
    );
  }

  selectPromoter(promoter: any) {
    this.selectedPromoter = promoter;
    this.modalController.dismiss(promoter);
  }

  closeModal() {
    this.modalController.dismiss();
  }
}
