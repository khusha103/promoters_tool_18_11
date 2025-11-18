import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { CustomProductModalComponent } from '../custom-product-modal/custom-product-modal.component';

@Component({
  selector: 'app-custom-product-dropdown',
  templateUrl: './custom-product-dropdown.component.html',
  styleUrls: ['./custom-product-dropdown.component.scss'],
})
export class CustomProductDropdownComponent implements OnInit {
  @Input() products: Array<{ id: string; code: string; name: string; segment: string; category_id: string; active: boolean }> = [];
  @Input() restoreProduct: any;

  @Output() productSelected = new EventEmitter<string>();

  selectedProduct: any | null = null; // Initialize selectedProduct

  constructor(private modalController: ModalController) {}

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['restoreProduct'] && changes['restoreProduct'].currentValue) {
      this.selectedProduct = changes['restoreProduct'].currentValue; // Set dropdown value
    }
  }
  

  async openModal() {
    const modal = await this.modalController.create({
      component: CustomProductModalComponent,
      componentProps: {
        products: this.products,
      },
    });

    modal.onDidDismiss().then((data) => {
      if (data.data) {
        this.selectedProduct = data.data; 
        // this.productSelected.emit(this.selectedProduct.id); 
        this.productSelected.emit(this.selectedProduct); 

      }
    });

    return await modal.present();
  }
}