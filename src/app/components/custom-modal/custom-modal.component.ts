import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-custom-modal',
  templateUrl: './custom-modal.component.html',
})
export class CustomModalComponent {
  @Input() languages: Array<{ value: string; name: string; id:string }> = [];
  filteredLanguages: Array<{ value: string; name: string; id:string }> = [];

  constructor(private modalController: ModalController) {}

  ngOnInit() {
    this.filteredLanguages = [...this.languages];
  }

  filterLanguages(event: CustomEvent) {
    const searchTerm = event.detail.value.toLowerCase();
    this.filteredLanguages = this.languages.filter(lang => 
      lang.name.toLowerCase().includes(searchTerm)
    );
  }

  selectLanguage(language: any) {
    this.modalController.dismiss(language);
  }

  cancel() {
    this.modalController.dismiss();
  }
}