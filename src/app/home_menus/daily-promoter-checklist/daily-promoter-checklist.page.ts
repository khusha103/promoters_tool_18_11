import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { DropdownCountryComponent } from 'src/app/components/dropdown-country/dropdown-country.component';
import { DropdownOutletComponent } from 'src/app/components/dropdown-outlet/dropdown-outlet.component';
import { DropdownPromoterComponent } from 'src/app/components/dropdown-promoter/dropdown-promoter.component';
import { DropdownRetailerComponent } from 'src/app/components/dropdown-retailer/dropdown-retailer.component';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-daily-promoter-checklist',
  templateUrl: './daily-promoter-checklist.page.html',
  styleUrls: ['./daily-promoter-checklist.page.scss'],
})
export class DailyPromoterChecklistPage implements OnInit {
  countries: any[] = [];
  retailers: any[] = [];
  alloutlets: any[] = [];
  allretailers: any[] = [];
  useroutlet: any;
  usercategory: any;
  outlets: any[] = [];
  categories: any[] = [];

  selectedCountry: any;
  selectedRetailer: any;
  selectedOutlet: any;
  selectedCategory: any;

  categoryOptions = { header: 'Select Category' };
  countryOptions  = { header: 'Select Country'  };
  retailerOptions = { header: 'Select Retailer' };
  storeOptions    = { header: 'Select Store'    };
  promoterOptions = { header: 'Select Promoter' };

  promoters: any[] = [];
  selectedPromoter: any;

  errorMessage: string | undefined;
  pic: any;

  constructor(
    private apiService: ApiService,
    private router: Router,
    private modalController: ModalController
  ) {}

  ngOnInit() {}

  ionViewDidEnter() {
    this.fetchAllCountries();
    this.fetchAllCategories();
    this.fetchAllRetailers();
    this.fetchAllOutlets();
  }

  async openCountrySelectModal() {
    const modal = await this.modalController.create({
      component: DropdownCountryComponent,
      componentProps: {}
    });

    modal.onDidDismiss().then((result) => {
      if (result.data) {
        this.selectedCountry = result.data;
        this.onCountryChange();
      }
    });

    return await modal.present();
  }

  async openRetailerSelectModal() {
    const modal = await this.modalController.create({
      component: DropdownRetailerComponent,
      componentProps: { retailers: this.retailers }
    });

    modal.onDidDismiss().then((result) => {
      if (result.data) {
        this.selectedRetailer = result.data;
        this.onRetailerChange();
      }
    });

    return await modal.present();
  }

  async openOutletSelectModal() {
    const modal = await this.modalController.create({
      component: DropdownOutletComponent,
      componentProps: { outlets: this.outlets }
    });

    modal.onDidDismiss().then((result) => {
      if (result.data) {
        this.selectedOutlet = result.data;
      }
    });

    return await modal.present();
  }

  fetchAllOutlets() {
    this.apiService.getAllOutlets().subscribe(
      (response) => { this.alloutlets = response.data; },
      (error) => { console.error('Error fetching outlets:', error); }
    );
  }

  fetchAllRetailers() {
    this.apiService.getAllRetailers().subscribe(
      (response) => { this.allretailers = response.data; },
      (error) => { console.error('Error fetching Retailers:', error); }
    );
  }

  fetchAllCategories() {
    this.apiService.getAllCategories().subscribe(
      (response) => {
        if (response.status) {
          this.categories = response.data;
        } else {
          console.error('Failed to fetch categories:', response.message);
        }
      },
      (error) => { console.error('Error fetching categories:', error); }
    );
  }

  fetchAllCountries() {
    return new Promise((resolve, reject) => {
      this.apiService.getAllCountries().subscribe(
        (response) => {
          this.countries = response.data;
          resolve(this.countries);
        },
        (error) => {
          console.error('Error fetching countries:', error);
          reject(error);
        }
      );
    });
  }

  onCountryChange() {
    this.retailers = [];
    this.outlets = [];
    this.selectedRetailer = null;
    this.selectedOutlet = null;
    if (this.selectedCountry) {
      this.fetchRetailersByCountry(this.selectedCountry.id);
      this.loadPromoters(this.selectedCountry.id);
    }
  }

  fetchRetailersByCountry(countryId: number): Promise<void> {
    return new Promise((resolve, reject) => {
      this.apiService.getRetailersByCountry(countryId).subscribe(
        (response) => {
          if (response.status) {
            this.retailers = response.data;
            if (this.retailers.length === 0) {
              this.retailers.push({ id: null, name: 'No Retailers Found', disabled: true });
            }
            resolve();
          } else {
            this.retailers.push({ id: null, name: 'No Retailers Found', disabled: true });
            resolve();
          }
        },
        (error) => {
          console.error('Error fetching retailers:', error);
          this.retailers.push({ id: null, name: 'Error fetching retailers', disabled: true });
          reject(error);
        }
      );
    });
  }

  onRetailerChange() {
    this.outlets = [];
    this.selectedOutlet = null;
    if (this.selectedRetailer && this.selectedRetailer.id !== null) {
      this.fetchOutletsByRetailerAndCountry(this.selectedRetailer.id, this.selectedCountry.id);
    }
  }

  fetchOutletsByRetailerAndCountry(retailerId: number, countryId: number): Promise<void> {
    return new Promise((resolve, reject) => {
      this.apiService.getOutletsByRetailerAndCountry(retailerId, countryId).subscribe(
        (response) => {
          if (response.status) {
            this.outlets = response.data;
            if (this.outlets.length === 0) {
              this.outlets.push({ id: null, name: 'No Outlets Found', disabled: true });
            }
            resolve();
          } else {
            this.outlets.push({ id: null, name: 'No Outlets Found', disabled: true });
            resolve();
          }
        },
        (error) => {
          console.error('Error fetching outlets:', error);
          this.outlets.push({ id: null, name: 'Error fetching outlets', disabled: true });
          reject(error);
        }
      );
    });
  }

  loadPromoters(countryId: number) {
    this.apiService.getPromotersByCountry(countryId).subscribe(
      (data) => { this.promoters = data; },
      (error) => { console.error('Error fetching promoters:', error); }
    );
  }

  async openPromoterSelectModal() {
    const modal = await this.modalController.create({
      component: DropdownPromoterComponent,
      componentProps: { promoters: this.promoters }
    });

    modal.onDidDismiss().then((result) => {
      if (result.data) {
        this.selectedPromoter = result.data;
      }
    });

    return await modal.present();
  }

  async onCategoryChange(categoryId: number) {
    if (categoryId) {
      this.usercategory = categoryId;
      this.fetchPIC();
    } else {
      this.usercategory = null;
    }
  }

  fetchPIC() {
    const storeId = this.selectedOutlet?.id;
    if (!storeId) { return; }

    this.apiService.getOutletPic(storeId).subscribe(
      (response) => {
        this.pic = response;
      },
      (error) => {
        this.errorMessage = 'An error occurred while fetching data';
        console.log('Error:', error);
      }
    );
  }

  // Programmatic navigation helper (explicit, logs before navigate)
  goToChecklist() {
    const params = {
      categoryId: this.selectedCategory?.id,
      countryId: this.selectedCountry?.id,
      promoterId: this.selectedPromoter?.id,
      storeId: this.selectedOutlet?.id
    };
    console.log('goToChecklist params:', params);
    this.router.navigate(['/daily-promoter-checklist-ques'], { queryParams: params });
  }

  // small helper used on click to log values (keeps routerLink usable)
  logPreNavigate() {
    console.log('Click navigate values:', {
      selectedCategory: this.selectedCategory,
      selectedCountry: this.selectedCountry,
      selectedOutlet: this.selectedOutlet,
      selectedPromoter: this.selectedPromoter,
      ids: {
        categoryId: this.selectedCategory?.id,
        countryId: this.selectedCountry?.id,
        storeId: this.selectedOutlet?.id,
        promoterId: this.selectedPromoter?.id
      }
    });
  }
}
