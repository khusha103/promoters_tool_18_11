import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';
import { ToastController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';
import { Subscription } from 'rxjs'; // Make sure this import is present

interface Icon {
  id: string;
  imageUrl: string;
  isActive: boolean;
}

@Component({
  selector: 'app-planogram-ideal',
  templateUrl: './planogram-ideal.page.html',
  styleUrls: ['./planogram-ideal.page.scss'],
})
export class PlanogramIdealPage implements OnInit {

  // icons = [
  //   { imageUrl: '/assets/icon/Productspageicons/tc.svg', isActive: true },
  //   { imageUrl: '/assets/icon/Productspageicons/camera.svg', isActive: false },
  //   { imageUrl: '/assets/icon/Productspageicons/headphone.svg' , isActive: false},
  //   { imageUrl: '/assets/icon/Productspageicons/speaker.svg' , isActive: false}
  // ];

  // contents = [
  //   {
  //     imageUrl: '/assets/icon/televisions.png',
  //     title: 'TELEVISIONS',
  //     buttons: ['X77L', 'X80L', 'X85L','X77L', 'X80L', 'X85L']
  //   },
  //   {
  //     imageUrl: '/assets/icon/digital_imaging.png',
  //     title: 'DIGITAL IMAGING',
  //     buttons: ['Alpha 9III', 'Alpha 7CR', 'SEL300F28GM', 'ECM-S1', 'ALPHA 7CII', 'ZV-1M2', 'A6700', 'ZV-E1', 'ALPHA 7RV']
  //   },
  //   {
  //     imageUrl: '/assets/icon/personal_audio.png',
  //     title: 'PERSONAL AUDIO',
  //     buttons: ['xlls1', 'xlls2', 'xlls2','xlls4', 'xlls5', 'xlls6','xlls1', 'xlls2', 'xlls2','xlls4', 'xlls5', 'xlls6']
  //   },
  //   {
  //     imageUrl: '/assets/icon/home_audio.png',
  //     title: 'HOME AUDIO',
  //     buttons: ['x77h1', 'x77h2', 'x77h3', 'x77h4', 'x77h5', 'x77h7','x77h1', 'x77h2', 'x77h3', 'x77h4', 'x77h5', 'x77h7']
  //   }
  // ];

  // selectedContent: any;
  // selectedProduct: any = null;
  // getProductImage(productName: string): string {
  //   // Replace this with your logic to get the correct image path for each product
  //   return `/assets/icon/salesproduct/${productName.toLowerCase().replace(' ', '_')}.png`;
  // }
  // constructor(private router: Router) { }

  // ngOnInit() {
  //   this.selectedContent = this.contents[0];
  // }

  // selectIcon(index: number) {
  //   this.icons.forEach((icon, i) => {
  //     icon.isActive = i === index;
  //   });
  //   this.selectedContent = this.contents[index];
  //   this.selectedProduct = null;
  // }
  // // selectProduct(product: any) {
  // //   let navigationExtras: NavigationExtras = {
  // //     state: {
  // //       product: product,
  // //       productImage: this.getProductImage(product)
  // //     }
  // //   };
  // //   this.router.navigate(['/product-inner'], navigationExtras);
  // // }
  // selectProduct(product: string) {
  //   let navigationExtras: NavigationExtras = {
  //     state: {
  //       product: product,
  //       productImage: this.getProductImage(product),
  //       productName: product // Pass the product name
  //     }
  //   };
  //   this.router.navigate(['/product-inner'], navigationExtras);
  // }


  categories: any[] = []; // ✅ Fix: Declare categories
  iconss: any[] = [];      // ✅ Make sure icons is also declared
  icons: Icon[] = [];
  currentTheme: 'light' | 'dark' = 'light';
  categorySubscription: Subscription | null = null; // ✅ Add this line


  // icons = [
  //   { imageUrl: '/assets/icon/Productspageicons/tc.svg', isActive: true },
  //   { imageUrl: '/assets/icon/Productspageicons/camera.svg', isActive: false },
  //   { imageUrl: '/assets/icon/Productspageicons/headphone.svg' , isActive: false},
  //   { imageUrl: '/assets/icon/Productspageicons/speaker.svg' , isActive: false}
  // ];

  contents = [
    {
      id: "1",
      imageUrl: '/assets/icon/televisions.png',
      title: 'TELEVISIONS'
    },
    {
      id: "2",
      imageUrl: '/assets/icon/digital_imaging.png',
      title: 'DIGITAL IMAGING'
    },
    {
      id: "3",
      imageUrl: '/assets/icon/personal_audio.png',
      title: 'PERSONAL AUDIO'
    },
    {
      id: "4",
      imageUrl: '/assets/icon/home_audio.png',
      title: 'HOME AUDIO'
    }
  ];


  retailerOptions = {
    header: 'Select Retailer'
  };

  storeOptions = {
    header: 'Select Store'
  };

  selectedContent: any;
  // selectedProduct: any = null;
  // getProductImage(productName: string): string {
  //   // Replace this with your logic to get the correct image path for each product
  //   return `/assets/icon/salesproduct/${productName.toLowerCase().replace(' ', '_')}.png`;
  // }
  constructor(private authservice: AuthService, private router: Router, private userService: UserService, private apiService: ApiService, private iab: InAppBrowser, private toastController: ToastController) { }

  ngOnInit() {
    this.selectedContent = this.contents[0];

    this.fetchAllCountries();
    this.fetchAllCategories();
    // this.fetchUserData();
    this.getUserRole();
  }

  ionViewWillEnter() {
    this.selectedContent = this.contents[0];

    this.fetchAllCountries();
    this.fetchAllCategories();
    this.getUserRole();

    // this.fetchUserData();
  }

  // fetchAllCategories() {
  //   this.apiService.getAllCategories().subscribe(
  //     (response) => {
  //       if (response.status) {
  //         this.categories = response.data; // Store fetched categories

  //         // ✅ Populate icons dynamically
  //         this.icons = this.categories.map((category: any, index: number) => ({
  //           id: category.id,
  //           imageUrl: category.image, // Ensure this matches the correct field
  //           isActive: index === 0, // First icon active by default
  //         }));

  //         console.log("Dynamic icons loaded:", this.icons);

  //         // ✅ Automatically select first category
  //         if (this.icons.length > 0) {
  //           this.selectIcon(0);
  //         }
  //       } else {
  //         console.error("Failed to fetch categories:", response.message);
  //       }
  //     },
  //     (error) => {
  //       console.error("Error fetching categories:", error);
  //     }
  //   );
  // }

  fetchAllCategories(forceRefresh: boolean = false) {
  const isDarkMode =
    document.body.classList.contains('dark') ||
    document.body.classList.contains('dark_pta');
  const newTheme = isDarkMode ? 'dark' : 'light';

  if (
    !forceRefresh &&
    newTheme === this.currentTheme &&
    this.categories.length > 0
  ) {
    console.log('No theme change & categories already loaded — skipping.');
    return;
  }

  this.currentTheme = newTheme;
  console.log('Fetching icons for theme:', this.currentTheme);

  const categoryObservable = isDarkMode
    ? this.apiService.getCategoryDark()
    : this.apiService.getCategoryLight();

  // Unsubscribe previous subscription if any
  if (this.categorySubscription) this.categorySubscription.unsubscribe();

  this.categorySubscription = categoryObservable.subscribe(
    (response) => {
      if (response.status) {
        this.categories = response.data;

        // ✅ Populate icons dynamically
        this.icons = this.categories.map((category: any, index: number) => ({
          id: category.id,
          title: category.category_name,
          imageUrl: category.image,
          isActive: index === 0, // First icon active
        }));

        console.log('Dynamic icons loaded:', this.icons);

        // ✅ Automatically select first category
        if (this.icons.length > 0) {
          this.selectIcon(0); // Call selectIcon method if defined
        }
      } else {
        console.error('Failed to fetch categories:', response.message);
      }
    },
    (error) => {
      console.error('Error fetching categories:', error);
    }
  );
}


  selectIcons(index: number) {
    this.icons.forEach((icon, i) => {
      icon.isActive = i === index;
    });

    // ✅ Ensure selected category updates dynamically
    this.selectedContent = this.categories[index] || { category_name: 'No Title Available' };

    console.log("Selected Category:", this.selectedContent);
  }
  // ------------------------------------------dropddowns work on 24 sept-----------------------------

  selectedCountry: any;
  selectedRetailer: any;
  selectedOutlet: any;

  countries: any[] = [];
  retailers: any[] = [];
  outlets: any[] = [];
  planograms: any[] = []; // To store fetched planograms



  fetchAllCountries() {
    this.apiService.getAllCountries().subscribe(
      (response) => {
        this.countries = response.data;
      },
      (error) => {
        console.error('Error fetching countries:', error);
      }
    );
  }

  


  // fetchUserData() {
  //   const userIdString = localStorage.getItem('userId');
  //   const userId = userIdString ? Number(userIdString) : null;

  //   if (userId !== null) {
  //     this.userService.fetchUserData(userId).subscribe(
  //       (response) => {
  //         if (response.status) {
  //           // this.setUserData(response.data);
  //         } else {
  //           console.error('Failed to fetch user data:', response.message);
  //         }
  //       },
  //       (error) => {
  //         console.error('Error fetching user data:', error);
  //       }
  //     );
  //   }
  // }

  //call get userrole function to set country id here for both pta and hp
  roleId: string | null = null;
  lang: string | null = null;
  cid: string | null = null;
  errorMessage: string | null = null;

  getUserRole() {
    const UserId = localStorage.getItem('userId');
    if (UserId) {
      this.authservice.getUserRole(UserId).subscribe({
        next: (response) => {
          if (response.status) {
            this.roleId = response.data.role_id;
            this.cid = response.data.region_id;
            // Check if cid is not defined
            if (!this.cid) {
              // this.displayLocationAlert('User location is not defined.');
              return; // Exit the function if location is not defined
            }
            const countryId = Number(this.cid);
            const appSelection = localStorage.getItem('app_selection');
            this.selectedCountry = appSelection === '1'
              ? Number(this.cid)
              : appSelection === '2'
                ? Number(localStorage.getItem('cnt_wip'))
                : null;


            this.fetchRetailersByCountry(this.selectedCountry);
            // When roleId and cid are available, call methods

          } else {
            this.errorMessage = response.message; // Handle error message
          }
        },
        error: (error) => {
          console.error('API Error:', error);
          this.errorMessage = 'Failed to retrieve user role. Please try again later.';
        }
      });
    }
  }

  // setUserData(userData: any) {
  //   const country = this.countries.find(c => c.name === userData.countryname);
  //   if (country) {
  //     this.selectedCountry = country;
  //   }


  //   this.fetchRetailersByCountry(this.selectedCountry.id).then(() => {

  //     const retailer = this.retailers.find(r => r.name === userData.retailer_name);
  //     if (retailer) {
  //       this.selectedRetailer = retailer;
  //       this.onRetailerChange();
  //     }

  //     // console.log("sdasdasdasd",this.selectedRetailer.id, this.selectedCountry.id);
  //     this.fetchOutletsByRetailerAndCountry(this.selectedRetailer.id, this.selectedCountry.id).then(() => {
  //       // console.log("User Data Store Name:", userData.store_name);
  //       // console.log("dsdsdd",this.outlets);
  //       const outlet = this.outlets.find(o => o.name === userData.store_name);
  //       // console.log("dsdsasdasasdasdsdd",outlet);//undeinfed show

  //       if (outlet) {
  //         this.selectedOutlet = outlet;
  //       }
  //     });
  //   });
  // }


  fetchRetailersByCountry(countryId: number): Promise<void> {
    return new Promise((resolve, reject) => {
      this.apiService.getRetailersByCountry(countryId).subscribe(
        (response) => {
          if (response.status) {
            this.retailers = response.data;

            // console.log("retailers",this.retailers);
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
    this.outlets = []; // Clear outlets when retailer changes
    this.selectedOutlet = null; // Reset selected outlet
    if (this.selectedRetailer && this.selectedRetailer.id !== null) {
      // this.fetchOutletsByRetailerAndCountry(this.selectedRetailer.id, this.selectedCountry.id);
      this.fetchOutletsByRetailerAndCountry(this.selectedRetailer.id, this.selectedCountry);

    }
  }



  fetchOutletsByRetailerAndCountry(retailerId: number, countryId: number): Promise<void> {
    return new Promise((resolve, reject) => {
      this.apiService.getOutletsByRetailerAndCountry(retailerId, countryId).subscribe(
        (response) => {
          if (response.status) {
            this.outlets = response.data;

            // Check if no outlets found
            if (this.outlets.length === 0) {
              this.outlets.push({ id: null, name: 'No Outlets Found', disabled: true });
            }
            resolve(); // Resolve the promise after fetching outlets
          } else {
            this.outlets.push({ id: null, name: 'No Outlets Found', disabled: true });
            resolve(); // Resolve even if no outlets found
          }
        },
        (error) => {
          console.error('Error fetching outlets:', error);
          this.outlets.push({ id: null, name: 'Error fetching outlets', disabled: true });
          reject(error); // Reject the promise on error
        }
      );
    });
  }

  onOutletChange() {
    console.log(this.icons);
    const activeCategory = this.icons.find(icon => icon.isActive);
    console.log(activeCategory);

    const activeCategoryId = Number(activeCategory ? activeCategory.id : null);
    this.fetchPlanograms(activeCategoryId, this.selectedOutlet.id);

  }

  // ------------------------------------------dropddowns work on 24 sept-----------------------------


  selectIcon(index: number) {
    this.icons.forEach((icon, i) => {
      icon.isActive = i === index;
    });
    this.selectedContent = this.contents[index];
    console.log(this.selectedContent);
    // Fetch planograms based on the selected icon's ID

    this.fetchPlanograms(this.selectedContent.id, this.selectedOutlet.id);

  }

  fetchPlanograms(categoryId: number, storeId: number) {
    this.apiService.getPlanogramsByCategoryId(categoryId, storeId).subscribe(
      (response) => {
        if (response && response.data.length > 0) {
          // if (1) {
          // If data is found, process it
          this.planograms = response.data;
          console.log('Fetched Planograms:', this.planograms);
        } else {
          // Handle case where no data is found
          this.planograms = [];
          console.error('No data found');
          this.handleNoData();
        }
      },
      (error) => {
        console.error('Error fetching planograms', error);
        this.handleError();
      }
    );
  }

  async handleNoData() {
    // Show toast message for no data found scenario
    const toast = await this.toastController.create({
      message: 'No planograms Guides available',
      color: 'danger', // This sets the background to light red
      duration: 2000, // Duration in milliseconds
      position: 'bottom' // Position of the toast
    });
    toast.present();
  }

  async handleError() {
    // Show toast message for error scenario
    const toast = await this.toastController.create({
      message: 'An error occurred while fetching planograms. Please try again later.',
      color: 'danger', // This sets the background to light red
      duration: 2000, // Duration in milliseconds
      position: 'bottom' // Position of the toast
    });
    toast.present();
  }


  openForm(url: string) {
    // Logic to open the PDF form or navigate to another page
    console.log('Opening form at:', url);
    // You can use Angular Router to navigate to another component or page
    // this.router.navigate([url]);
    window.open(url, '_blank'); // Open in a new tab
  }

}