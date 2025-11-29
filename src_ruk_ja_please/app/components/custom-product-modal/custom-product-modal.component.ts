import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-custom-product-modal',
  templateUrl: './custom-product-modal.component.html',
})
export class CustomProductModalComponent {
  @Input() products: Array<{ id: string; code: string; name: string; segment: string; category_id: string; active: boolean }> = [];
  filteredProducts: Array<{ id: string; code: string; name: string; segment: string; category_id: string; active: boolean }> = [];

  constructor(private modalController: ModalController) {}

  ngOnInit() {
    this.filteredProducts = [...this.products]; // Initialize with all products
  }

  filterProducts(event: CustomEvent) {
    const searchTerm = event.detail.value.toLowerCase();
    this.filteredProducts = this.products.filter(product => 
      product.name.toLowerCase().includes(searchTerm)
    );
  }

  selectProduct(product: any) {
    this.modalController.dismiss(product); // Pass selected product back to the parent
  }

  cancel() {
    this.modalController.dismiss(); // Dismiss modal without selection
  }
}