import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { CustomModalComponent } from '../custom-modal/custom-modal.component'; // Import your modal component

@Component({
  selector: 'app-custom-dropdown',
  templateUrl: './custom-dropdown.component.html',
  styleUrls: ['./custom-dropdown.component.scss'],
})
export class CustomDropdownComponent implements OnInit {
  @Input() languages: Array<{ value: string; name: string; id:string }> = [];//check can i pass dynamic objects in array so that use for all dropdowns
  @Output() languageSelected = new EventEmitter<string>();
  
  selectedLanguage: any | undefined;

  constructor(private modalController: ModalController) {}

  ngOnInit() {}

  async openModal() {
    const modal = await this.modalController.create({
      component: CustomModalComponent,
      componentProps: {
        languages: this.languages,
      },
    });

    modal.onDidDismiss().then((data) => {
      if (data.data) {
        this.selectedLanguage = data.data;
        this.languageSelected.emit(this.selectedLanguage);
      }
    });

    return await modal.present();
  }

  getDisplayLanguage(): any {
    if(this.selectedLanguage)
    return this.selectedLanguage.name || 'Select Language';
  }
}