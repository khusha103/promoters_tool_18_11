import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-promoter-dropdown',
  templateUrl: './promoter-dropdown.component.html',
  styleUrls: ['./promoter-dropdown.component.scss'],
})
export class PromoterDropdownComponent  implements OnInit {
  @Input() countryId!: number; // Input from parent component
  selectedPromoter: any;
  promoters: any[] = [];
  filteredPromoters: any[] = [];
  searchText: string = '';

  constructor(private promoterService: ApiService, private modalController: ModalController) {}

  ngOnInit() {
    this.loadPromoters();
  }

  loadPromoters() {
    if (this.countryId) {
      this.promoterService.getPromotersByCountry(this.countryId).subscribe(
        (data) => {
          this.promoters = data;
          this.filteredPromoters = data; // Initialize filtered list
          console.log(this.promoters);
        },
        (error) => {
          console.error('Error fetching promoters:', error);
        }
      );
    }
  }

  filterPromoters() {
    const searchTerm = this.searchText.toLowerCase();
    console.log(searchTerm);

    this.filteredPromoters = this.promoters.filter(promoter =>
      promoter.name.toLowerCase().includes(searchTerm)
    );
  }

  selectPromoter(promoter: any) {
    this.selectedPromoter = promoter;
    this.modalController.dismiss(promoter); // Dismiss modal and return selected promoter
  }

  closeModal() {
    this.modalController.dismiss(); // Close modal without selection
  }

}
