import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-search-dropdownmodal',
  templateUrl: './search-dropdownmodal.component.html',
  styleUrls: ['./search-dropdownmodal.component.scss'],
})
export class SearchDropdownmodalComponent  implements OnInit {

  @Input() options: Array<{ value: string; name: string; id:string ,segment:string }> = [];
  filteredOptions: Array<{ value: string; name: string; id:string ,segment:string}> = [];

  constructor(private modalController: ModalController) {}

  ngOnInit() {
    this.filteredOptions = [...this.options];
  }

  filterOptions(event: CustomEvent) {
    const searchTerm = event.detail.value.toLowerCase();
    this.filteredOptions = this.options.filter(lang => 
      lang.name.toLowerCase().includes(searchTerm)
    );
  }

  selectOption(option: any) {
    this.modalController.dismiss(option);
  }

  cancel() {
    this.modalController.dismiss();
  }

}
