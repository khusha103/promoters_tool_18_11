import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IonPopover, ToastController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-basic-details',
  templateUrl: './basic-details.page.html',
  styleUrls: ['./basic-details.page.scss'],
})
export class BasicDetailsPage implements OnInit {
  selectedDateOfBirth!: string;
  selectedDateOfJoining!: string;
  gender!: string;
  nationalityId: number | undefined;
  categoryId: number[] = [];
  categoryIdd: any[] = ['2', '3', '4'];

  categories: any[] = [];
  existingBasicDetails: any;

  @ViewChild('dobPopover') dobPopover?: IonPopover;
  @ViewChild('dojPopover') dojPopover?: IonPopover;

  isDateOfBirthPopoverOpen: boolean = false;
  isDateOfJoiningPopoverOpen: boolean = false;

  constructor(private apiService: ApiService, private toastController: ToastController,
    private router: Router) { }

  ngOnInit() {
    this.loadCategories();
    this.nationalityId = 0;
    this.fetchExistingBasicDetails();
  }
  fetchExistingBasicDetails() {
    const userIdString = localStorage.getItem('userId');
    const userId = userIdString ? Number(userIdString) : null;


    if (userId !== null) {
      this.apiService.getBasicDetails(userId).subscribe(
        response => {
          if (response.status) {
            this.existingBasicDetails = response.data;
            // console.log(this.existingBasicDetails);
            this.pre_fillForm(); // Pre-fill the form with existing data
          } else {
            console.error('Failed to fetch basic details');
          }
        },
        error => {
          console.error('Error fetching basic details', error);
        }
      );
    }
  }


  pre_fillForm() {
    this.selectedDateOfBirth = this.existingBasicDetails.birth_date;
    this.selectedDateOfJoining = this.existingBasicDetails.joining_date;
    this.gender = this.existingBasicDetails.gender;
    this.nationalityId = this.existingBasicDetails.nationality_id;

    this.categoryId = this.existingBasicDetails.category_id.split(',');
  }

  loadCategories() {
    this.apiService.getSonyCategories().subscribe(
      response => {
        if (response.status) {
          this.categories = response.data;
        } else {
          console.error('Failed to load categories');
        }
      },
      error => {
        console.error('Error loading categories', error);
      }
    );
  }

  showDateOfBirthPopover() {
    this.isDateOfBirthPopoverOpen = true;
  }

  showDateOfJoiningPopover() {
    this.isDateOfJoiningPopoverOpen = true;
  }

  onDateOfBirthChange(event: any) {
    this.selectedDateOfBirth = event.detail.value;
    this.isDateOfBirthPopoverOpen = false;
    this.dobPopover?.dismiss();
  }

  onDateOfJoiningChange(event: any) {
    this.selectedDateOfJoining = event.detail.value;
    this.isDateOfJoiningPopoverOpen = false;
    this.dojPopover?.dismiss();
  }

  saveBasicDetails() {
    const userIdString = localStorage.getItem('userId');
    if (userIdString) {
      const userId = parseInt(userIdString);

      const formData = {
        user_id: userId,
        birth_date: this.selectedDateOfBirth,
        gender: this.gender,
        nationality_id: this.nationalityId,
        category_id: this.categoryId,
        joining_date: this.selectedDateOfJoining
      };

      this.apiService.saveBasicDetails(formData).subscribe(
        async response => {
          if (response.status) {
            console.log('Details saved successfully');
            await this.showToast('Details saved successfully', 'success');
            this.router.navigate(['/home']);
          } else {
            console.error('Failed to save details');
          }
        },
        error => {
          console.error('Error saving details', error);
        }
      );
    }
  }


  async showToast(message: string, color: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 3000,
      color: color,
      position: 'top'
    });
  }

}

