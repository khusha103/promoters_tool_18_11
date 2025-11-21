import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';

import { DropdownCountryComponent } from 'src/app/components/dropdown-country/dropdown-country.component';
import { DropdownRetailerComponent } from 'src/app/components/dropdown-retailer/dropdown-retailer.component';
import { DropdownOutletComponent } from 'src/app/components/dropdown-outlet/dropdown-outlet.component';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-store-list',
  templateUrl: './store-list.page.html',
  styleUrls: ['./store-list.page.scss'],
})
export class StoreListPage implements OnInit {

  countries: any[] = [];
  retailers: any[] = [];
  stores: any[] = [];

  selectedCountry: any;
  selectedRetailer: any;
  selectedStore: any;
    // store the logged-in user's data for reuse
  currentUser: any = null;

  constructor(
    private apiService: ApiService,
    private modalCtrl: ModalController,
    private router: Router
  ) {}

  ngOnInit() {}

  ionViewDidEnter() {
    // When page appears, load user details then fetch countries (filtered if needed).
    this.loadUserAndFilterCountries();
  }

  /**
   * Load current user info from API (by userId from localStorage)
   * and then fetch countries. If user is VMD (role_id === 16) and API
   * returns country info, restrict countries list to those IDs.
   */
  private loadUserAndFilterCountries() {
    const userId = Number(localStorage.getItem('userId'));
    if (!userId) {
      console.log("code phat gya");
      // fallback: just load all countries
      this.fetchCountries();
      return;
    }

    // call getUserById - the service method you already have
    this.apiService.getUserById(userId).subscribe({
      next: (res: any) => {
        // store the user object for later use
        this.currentUser = res?.data ?? null;

        // If user role is 16 (VMD), attempt to extract allowed country id(s)
        const roleId = this.currentUser?.role_id ?? this.currentUser?.roleId ?? null;
        if (Number(roleId) === 16) {
          // try several possible shapes for country information returned by API
          let allowedCountryIds: number[] | null = null;

          // common shapes:
          // 1) res.data.countries -> array of country objects [{id: 2, name: '...'}, ...]
          if (Array.isArray(this.currentUser?.countries) && this.currentUser.countries.length) {
            allowedCountryIds = this.currentUser.countries
              .map((c: any) => (c && c.id) ? Number(c.id) : null)
              .filter((v: any) => v !== null);
          }

          // 2) res.data.country_id -> single id
          if (!allowedCountryIds || allowedCountryIds.length === 0) {
            const singleId = this.currentUser?.country_id ?? this.currentUser?.countryId ?? null;
            if (singleId !== null && singleId !== undefined) {
              allowedCountryIds = [Number(singleId)];
            }
          }

          // 3) res.data.country_ids -> array of ids
          if ((!allowedCountryIds || allowedCountryIds.length === 0) && Array.isArray(this.currentUser?.country_ids)) {
            allowedCountryIds = this.currentUser.country_ids.map((id: any) => Number(id));
          }

          // 4) res.data.country -> object { id: x, name: '...'}
          if ((!allowedCountryIds || allowedCountryIds.length === 0) && this.currentUser?.country && this.currentUser.country.id) {
            allowedCountryIds = [Number(this.currentUser.country.id)];
          }

          // Now fetch countries and apply filter if allowedCountryIds found
          if (allowedCountryIds && allowedCountryIds.length) {
            this.fetchCountries(allowedCountryIds);
          } else {
            // No explicit country data in user record -> fallback to all countries
            this.fetchCountries();
          }
        } else {
          // not a VMD -> show all countries
          this.fetchCountries();
        }
      },
      error: (err) => {
        console.error('getUserById error', err);
        // even if user API call fails, fallback to all countries to avoid blocking UI
        this.fetchCountries();
      }
    });
  }

  /**
   * Fetch all countries from API. If allowedCountryIds is supplied, filter the list.
   * @param allowedCountryIds optional array of allowed country ids (numbers)
   */
  fetchCountries(allowedCountryIds?: number[]) {
    this.apiService.getAllCountries().subscribe({
      next: (res: any) => {
        const all = res?.data ?? [];
        if (Array.isArray(allowedCountryIds) && allowedCountryIds.length) {
          // filter to only allowed ids (ensure numeric comparisons)
          this.countries = all.filter((c: any) => allowedCountryIds.map(Number).includes(Number(c?.id)));
        } else {
          this.countries = all;
        }
      },
      error: (err) => {
        console.error('getAllCountries error', err);
        this.countries = [];
      }
    });
  }

  fetchRetailers(countryId: number) {
    this.apiService.getRetailersByCountry(countryId).subscribe(res => {
      this.retailers = res.data;
    });
  }

  fetchStores(retailerId: number, countryId: number) {
    this.apiService.getOutletsByRetailerAndCountry(retailerId, countryId).subscribe(res => {
      this.stores = res.data;
    });
  }


  async openCountrySelectModal() {
    const modal = await this.modalCtrl.create({
      component: DropdownCountryComponent,
    });

    modal.onDidDismiss().then(result => {
      if (result.data) {
        this.selectedCountry = result.data;
        this.selectedRetailer = null;
        this.selectedStore = null;
        this.fetchRetailers(this.selectedCountry.id);
      }
    });

    modal.present();
  }

  async openRetailerSelectModal() {
    const modal = await this.modalCtrl.create({
      component: DropdownRetailerComponent,
      componentProps: { retailers: this.retailers }
    });

    modal.onDidDismiss().then(result => {
      if (result.data) {
        this.selectedRetailer = result.data;
        this.selectedStore = null;
        this.fetchStores(this.selectedRetailer.id, this.selectedCountry.id);
      }
    });

    modal.present();
  }

  async openStoreSelectModal() {
    const modal = await this.modalCtrl.create({
      component: DropdownOutletComponent,
      componentProps: { outlets: this.stores }
    });

    modal.onDidDismiss().then(result => {
      if (result.data) {
        this.selectedStore = result.data;
      }
    });

    modal.present();
  }

proceed() {
  if (!this.selectedStore || !this.selectedRetailer || !this.selectedCountry) return;

  this.router.navigate(
    ['/attendance'],
    {
      queryParams: {
        storeId: this.selectedStore.id,
        storeName: this.selectedStore.name,
        retailerId: this.selectedRetailer.id,
        retailerName: this.selectedRetailer.name,
        countryId: this.selectedCountry.id,
        roleId: localStorage.getItem('userRoleId') || '16'
      }
    }
  );
}



}
