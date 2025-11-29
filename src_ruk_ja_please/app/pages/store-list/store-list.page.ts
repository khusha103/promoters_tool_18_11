import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { ModalController, AlertController, AlertInput } from '@ionic/angular';

@Component({
  selector: 'app-store-list',
  templateUrl: './store-list.page.html',
  styleUrls: ['./store-list.page.scss'],
})
export class StoreListPage implements OnInit {
  // countries built from current user's multi_region_names / multi_region_id
  countries: Array<{ id: number | null; name: string }> = [];
  retailers: Array<any> = []; // expects objects with { id | aid, name }
  stores: Array<any> = []; // expects outlet objects with { id, name }

  selectedCountry: { id: number | null; name: string } | null = null;
  selectedRetailer: any = null;
  selectedStore: any = null;
  currentUser: any = null;

  constructor(
    private apiService: ApiService,
    private modalCtrl: ModalController,
    private alertCtrl: AlertController,
    private router: Router
  ) {}

  ngOnInit(): void {}

  ionViewDidEnter(): void {
    this.buildCountriesFromCurrentUser();
  }

  /**
   * Build countries list using only the current user's API response
   * (multi_region_names / multi_region_id). No calls to getAllCountries().
   */
  private buildCountriesFromCurrentUser(): void {
    const userIdStr = localStorage.getItem('userId');
    if (!userIdStr) {
      this.countries = [];
      return;
    }

    const userId = Number(userIdStr);
    if (isNaN(userId)) {
      this.countries = [];
      return;
    }

    this.apiService.getUserById(userId).subscribe({
      next: (res: any) => {
        this.currentUser = res?.data ?? null;
        if (!this.currentUser) {
          this.countries = [];
          return;
        }

        const multiNamesRaw: string | undefined = this.currentUser?.multi_region_names ?? undefined;
        const multiIdsRaw: string | undefined = this.currentUser?.multi_region_id ?? undefined;
        const singleCountryName: string | undefined =
          this.currentUser?.countryname ?? this.currentUser?.country_name ?? undefined;

        // parse ids
        let ids: (number | null)[] = [];
        if (multiIdsRaw) {
          ids = String(multiIdsRaw)
            .split(',')
            .map((s) => {
              const n = Number(s.trim());
              return isNaN(n) ? null : n;
            });
        }

        // parse names
        let names: string[] = [];
        if (multiNamesRaw) {
          names = String(multiNamesRaw)
            .split(',')
            .map((s) => s.trim())
            .filter((s) => s.length > 0);
        }

        // Build countries from multi_region_names (preferred)
        if (names.length > 0) {
          const count = Math.max(names.length, ids.length);
          const built: Array<{ id: number | null; name: string }> = [];
          for (let i = 0; i < count; i++) {
            built.push({
              id: ids[i] ?? null,
              name: names[i] ?? `Region ${i + 1}`,
            });
          }
          this.countries = built;
        } else if (singleCountryName) {
          // fallback to single country name
          this.countries = [{ id: null, name: String(singleCountryName).trim() }];
        } else {
          this.countries = [];
        }

        // Auto-select single option OR restore stored selection
        if (this.countries.length === 1) {
          this.selectedCountry = this.countries[0];
          const cid = this.selectedCountry?.id ?? null;
          if (cid !== null && cid !== undefined) {
            localStorage.setItem('cnt_wip', String(cid));
            this.fetchRetailers(cid);
          } else {
            localStorage.setItem('cnt_wip', this.selectedCountry.name);
            this.retailers = [];
          }
        } else {
          this.validateOrAutoSelectStoredCountry();
        }
      },
      error: (err) => {
        console.error('getUserById error', err);
        this.countries = [];
      },
    });
  }

  private validateOrAutoSelectStoredCountry(): void {
    const stored = localStorage.getItem('cnt_wip');
    if (!stored) return;

    const num = Number(stored);
    const match = this.countries.find((c) => {
      if (c.id !== null && c.id !== undefined && !isNaN(num)) {
        return Number(c.id) === num;
      }
      return c.name.toString().toLowerCase() === String(stored).toLowerCase();
    });

    if (match) {
      this.selectedCountry = match;
      if (match.id !== null && match.id !== undefined) {
        this.fetchRetailers(match.id);
      } else {
        this.retailers = [];
      }
    } else {
      localStorage.removeItem('cnt_wip');
    }
  }

  /**
   * Fetch retailers by numeric country id (only called when numeric id exists).
   * Populates this.retailers which will be used by openRetailerSelect().
   */
  fetchRetailers(countryId: number): void {
    if (countryId === null || countryId === undefined || isNaN(countryId)) {
      this.retailers = [];
      return;
    }

    this.apiService.getRetailersByCountry(countryId).subscribe({
      next: (res: any) => {
        // Expect res.data to be array of retailers. Keep as-is.
        this.retailers = res?.data ?? [];
      },
      error: (err) => {
        console.error('getRetailersByCountry error', err);
        this.retailers = [];
      },
    });
  }

  /**
   * Fetch stores/outlets for a retailer and country (numeric countryId required)
   * Populates this.stores used by openStoreSelect()
   */
  fetchStores(retailerId: number, countryId: number): void {
    if (countryId === null || countryId === undefined || isNaN(countryId)) {
      this.stores = [];
      return;
    }

    this.apiService.getOutletsByRetailerAndCountry(retailerId, countryId).subscribe({
      next: (res: any) => {
        this.stores = res?.data ?? [];
      },
      error: (err) => {
        console.error('getOutletsByRetailerAndCountry error', err);
        this.stores = [];
      },
    });
  }

  /**
   * Country picker — Alert radio list built from this.countries.
   * Opens even if there is exactly one country (user requested).
   */
  async openCountrySelect(): Promise<void> {
    const inputs: AlertInput[] = this.countries.map((c) => {
      return {
        name: c.name,
        type: 'radio' as 'radio',
        label: c.name,
        value: JSON.stringify(c),
        checked: this.selectedCountry ? (this.selectedCountry.id === c.id && this.selectedCountry.name === c.name) : false,
      } as AlertInput;
    });

    const alert = await this.alertCtrl.create({
      header: 'Select Country',
      inputs,
      buttons: [
        { text: 'Cancel', role: 'cancel' },
        {
          text: 'Select',
          handler: (value: any) => {
            try {
              const parsed = typeof value === 'string' ? JSON.parse(value) : value;
              if (parsed && parsed.name) {
                const selected = { id: parsed.id ?? null, name: String(parsed.name) };
                this.selectedCountry = selected;
                this.selectedRetailer = null;
                this.selectedStore = null;

                const cidOrName = (selected.id !== null && selected.id !== undefined) ? String(selected.id) : selected.name;
                localStorage.setItem('cnt_wip', cidOrName);

                if (selected.id !== null && selected.id !== undefined) {
                  this.fetchRetailers(selected.id);
                } else {
                  this.retailers = [];
                }
              }
            } catch (e) {
              console.error('Failed to parse selected country', e);
            }
            return true;
          },
        },
      ],
    });

    await alert.present();
  }


  async openRetailerSelect(): Promise<void> {
    if (!this.retailers || this.retailers.length === 0) {
      // optionally show toast or message here
      return;
    }

    const inputs: AlertInput[] = this.retailers.map((r) => {
      // r may have id or aid; use both for value
      const payload = { id: r.id ?? r.aid ?? null, name: r.name ?? r.retailer_name ?? r.label ?? String(r) };
      return {
        name: payload.name,
        type: 'radio' as 'radio',
        label: payload.name,
        value: JSON.stringify(payload),
        checked: this.selectedRetailer ? ((this.selectedRetailer.id ?? this.selectedRetailer.aid) === payload.id) : false,
      } as AlertInput;
    });

    const alert = await this.alertCtrl.create({
      header: 'Select Retailer',
      inputs,
      buttons: [
        { text: 'Cancel', role: 'cancel' },
        {
          text: 'Select',
          handler: (value: any) => {
            try {
              const parsed = typeof value === 'string' ? JSON.parse(value) : value;
              if (parsed && (parsed.id !== undefined)) {
                // set selectedRetailer minimal shape; keep original object if you want full data
                this.selectedRetailer = { id: parsed.id, name: parsed.name };
                this.selectedStore = null;
                const countryId = this.selectedCountry?.id;
                if (countryId !== null && countryId !== undefined) {
                  this.fetchStores(parsed.id, countryId);
                } else {
                  this.stores = [];
                }
              }
            } catch (e) {
              console.error('Failed to parse selected retailer', e);
            }
            return true;
          },
        },
      ],
    });

    await alert.present();
  }

  /**
   * Store picker — Alert radio list built from this.stores.
   */
  async openStoreSelect(): Promise<void> {
    if (!this.stores || this.stores.length === 0) {
      // optionally show toast or message
      return;
    }

    const inputs: AlertInput[] = this.stores.map((s) => {
      const payload = { id: s.id ?? s.store_id ?? null, name: s.name ?? s.store_name ?? s.label ?? String(s) };
      return {
        name: payload.name,
        type: 'radio' as 'radio',
        label: payload.name,
        value: JSON.stringify(payload),
        checked: this.selectedStore ? ((this.selectedStore.id ?? this.selectedStore.store_id) === payload.id) : false,
      } as AlertInput;
    });

    const alert = await this.alertCtrl.create({
      header: 'Select Store',
      inputs,
      buttons: [
        { text: 'Cancel', role: 'cancel' },
        {
          text: 'Select',
          handler: (value: any) => {
            try {
              const parsed = typeof value === 'string' ? JSON.parse(value) : value;
              if (parsed && parsed.id !== undefined) {
                this.selectedStore = { id: parsed.id, name: parsed.name };
              }
            } catch (e) {
              console.error('Failed to parse selected store', e);
            }
            return true;
          },
        },
      ],
    });

    await alert.present();
  }

  /**
   * Proceed to attendance route with safe params
   */
  proceed(): void {
    if (!this.selectedStore || !this.selectedRetailer || !this.selectedCountry) return;

    const countryParam = (this.selectedCountry.id !== null && this.selectedCountry.id !== undefined)
      ? this.selectedCountry.id
      : this.selectedCountry.name;

    const retailerIdParam = this.selectedRetailer?.aid ?? this.selectedRetailer?.id ?? this.selectedRetailer?.id;

    this.router.navigate(['/attendance'], {
      queryParams: {
        storeId: this.selectedStore?.id,
        storeName: this.selectedStore?.name,
        retailerId: retailerIdParam,
        retailerName: this.selectedRetailer?.name,
        countryId: countryParam,
        roleId: localStorage.getItem('userRoleId') || '16',
      },
    });
  }
}
