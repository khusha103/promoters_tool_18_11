import { Component, EventEmitter, Input, OnInit, Output, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { SearchDropdownmodalComponent } from '../search-dropdownmodal/search-dropdownmodal.component';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-search-dropdown',
  templateUrl: './search-dropdown.component.html',
  styleUrls: ['./search-dropdown.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SearchDropdownComponent),
      multi: true
    }
  ]
})
export class SearchDropdownComponent implements OnInit, ControlValueAccessor {

  @Input() options: Array<{ value: string; name: string; id: string }> = [];
  @Output() optionSelected = new EventEmitter<string>();

  selectedOptionValue: any | undefined;
  onChange: (value: any) => void = () => {}; // Default no-op function
  onTouched: () => void = () => {}; // Default no-op function

  constructor(private modalController: ModalController) {}

  ngOnInit() {}

  async openModal() {
    const modal = await this.modalController.create({
      component: SearchDropdownmodalComponent,
      componentProps: {
        options: this.options,
        selectedValue: this.selectedOptionValue // Pass current selected value to modal
      },
    });

    modal.onDidDismiss().then((data) => {
      if (data.data) {
        this.selectedOptionValue = data.data.id; // Update local selected value
        this.onChange(this.selectedOptionValue); // Notify the change
        this.optionSelected.emit(this.selectedOptionValue?.id); // Emit the new selection
        console.log(this.selectedOptionValue.id);
      }
    });

    return await modal.present();
  }

  getDisplayValue(): string {
    const selectedOption = this.options.find(option => option.id === this.selectedOptionValue);
    return selectedOption ? selectedOption.name : 'Select Attachment';
  }

  // ControlValueAccessor methods
  writeValue(value: any): void {
    this.selectedOptionValue = value;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    // Handle the disabled state if needed
  }
}