import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';
import { Browser } from '@capacitor/browser';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';
import { Subscription } from 'rxjs'; // Make sure this import is present

@Component({
  selector: 'app-display-guidelines',
  templateUrl: './display-guidelines.page.html',
  styleUrls: ['./display-guidelines.page.scss'],
})
export class DisplayGuidelinesPage implements OnInit {
  isLoading: boolean = true;
  activeCategoryId: number | null = null;
  categories: any[] = [];
  selectedCategoryTitle: string = '';
  selectedCategoryId!: number;
  guidelinesPdfs: any[] = [];
  countryId: number = 0;
  lang: string;
  errorMessage:any;
  mutationObserver: MutationObserver | null = null;
  currentTheme: 'light' | 'dark' = 'light';
  categorySubscription: Subscription | null = null; // ✅ Add this line


  // Manually assigned images for categories
  categoryImages: { [key: number]: { bannerImageUrl: string } } = {
    1: { bannerImageUrl: '/assets/icon/Sony-65-Inch-Smart-TV.png' },
    2: { bannerImageUrl: '/assets/icon/productspecification2.png' },
    3: { bannerImageUrl: '/assets/icon/productspecification3.png' },
    4: { bannerImageUrl: '/assets/icon/productspecification4.png' },
    5: { bannerImageUrl: '/assets/icon/productspecification4.png' },
  };

  constructor(private router: Router, private apiService: ApiService, private iab: InAppBrowser, private cd: ChangeDetectorRef,private authservice:AuthService) {
    this.lang = localStorage.getItem('lang') || 'en';

    setTimeout(() => {
      this.fetchAllCategories();
    }, 100); // slight delay (100ms) to let theme apply

    

    this.mutationObserver = new MutationObserver(() => {
      const isDark = document.body.classList.contains('dark') || document.body.classList.contains('dark_pta');
      const detectedTheme = isDark ? 'dark' : 'light';
    
      if (detectedTheme !== this.currentTheme) {
        console.log("Detected theme change to:", detectedTheme);
        this.fetchAllCategories(true); // only reload if actual change
      } else {
        console.log("Theme unchanged, skipping reload");
      }
    });
    
    this.mutationObserver.observe(document.body, {
      attributes: true,
      attributeFilter: ['class']
    });
  }

  ngOnInit(): void {
    // // this.fetchAllCategories();
    

    // const appSelection = localStorage.getItem('app_selection');
    // // console.log(appSelection);


    // if (appSelection === '2') {
    //   this.countryId = Number(localStorage.getItem('cnt_wip'));
    //   // console.log(this.countryId);
    //   this.fetchAllCategories();
    // }else{
    //   this.getUserRole();
    // }
  }

  ionViewWillEnter() {
    // this.fetchAllCategories();
    

    const appSelection = localStorage.getItem('app_selection');
    // console.log(appSelection);


    if (appSelection === '2') {
      this.countryId = Number(localStorage.getItem('cnt_wip'));
      // console.log(this.countryId);
      this.fetchAllCategories();
    }else{
      this.getUserRole();
    }
  }

  getUserRole() {
    const UserId = localStorage.getItem('userId');
    if (UserId) {
      this.authservice.getUserRole(UserId).subscribe({
        next: (response) => {
          if (response.status) {
            // console.log(response);
            // this.roleIdstring = response.data.role_id; // Extract role_id
            this.countryId = Number(response.data.region_id);
            // console.log(this.countryId);
            this.fetchAllCategories();
            //when get roleid then call methods
            // this.getUserId();
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

  ngOnDestroy() {
    if (this.mutationObserver) this.mutationObserver.disconnect();
    if (this.categorySubscription) this.categorySubscription.unsubscribe();
  }

  fetchAllCategories(forceRefresh: boolean = false) {
  const isDarkMode = document.body.classList.contains('dark') || document.body.classList.contains('dark_pta');
  const newTheme = isDarkMode ? 'dark' : 'light';

  if (!forceRefresh && newTheme === this.currentTheme && this.categories.length > 0) {
    console.log('No theme change & categories already loaded — skipping.');
    return;
  }

  this.currentTheme = newTheme;

  console.log("Fetching icons for theme:", this.currentTheme);

  const categoryObservable = isDarkMode
    ? this.apiService.getCategoryDark()
    : this.apiService.getCategoryLight();

  if (this.categorySubscription) this.categorySubscription.unsubscribe();

  this.categorySubscription = categoryObservable.subscribe(
    (response) => {
      if (response.status) {
        this.categories = response.data.map((category: any, index: number) => ({
          id: category.id,
          title: category.category_name,
          imageUrl: category.image,
          isActive: index === 0
        }));

        if (this.categories.length > 0) {
          this.changeCategory(this.categories[0].id);
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

  changeCategory(categoryId: number): void {
    this.activeCategoryId = categoryId;
    this.selectedCategoryId = categoryId;

    const selectedCategory = this.categories.find(cat => cat.id === categoryId);
    if (selectedCategory) {
      this.selectedCategoryTitle = selectedCategory.title;
    }

    this.loadCategorywiseGuidelinesData(categoryId);
  }

  loadCategorywiseGuidelinesData(categoryId: number): void {
    console.log("Country id in api",this.countryId);
    this.apiService.getGuidelines(this.countryId, categoryId, this.lang).subscribe(
      response => {
        if (response.status) {
          this.guidelinesPdfs = response.guidelines;
          // this.checkDocumentStatus();
        } else {
          console.error('No data found');
          this.handleNoData();
        }
      },
      error => {
        console.error('Error fetching guidelines', error);
        this.handleError();
      }
    );
  }

  handleNoData() {
    // alert("No guidelines available for the selected category.");
    this.guidelinesPdfs = [];
    // this.guidelinesPdfs = "dsdsds";
  }

  handleError() {
    alert("An error occurred while fetching guidelines. Please try again later.");
  }

  // openPdf(pdf: any) {
  //   console.log(pdf);
  //   const browser = this.iab.create(pdf.url, '_blank', {
  //     hidden: 'no',
  //     hardwareback: 'yes',
  //     fullscreen: 'no'
  //   });

  //   browser.on('exit').subscribe(() => {
  //     // console.log('InAppBrowser closed');
  //     this.checkDocumentStatus();
  //   });
  // }

  
 // Method to open a URL in the in-app browser with customization
 async openPdf(pdf: any) {
  console.log(pdf);
  const url = pdf.url;
  try {
    await Browser.open({
      url: url,
      toolbarColor: '#000000', // Customize toolbar color (hex code)
      presentationStyle: 'fullscreen' // Optional: presentation style for iOS
    });
  } catch (error) {
    console.error('Error opening in-app browser:', error);
    // Optionally, display an alert or notification for error handling
  }
}

  checkDocumentStatus() {
    const userId = Number(localStorage.getItem('userId'));

    this.apiService.getTrackingData(userId).subscribe(trackingResponse => {
      if (trackingResponse.status && Array.isArray(trackingResponse.data)) {
        const trackedDocumentIds = trackingResponse.data.map(entry => entry.module_doc_id);
        this.guidelinesPdfs.forEach(doc => {
          doc.isNew = !trackedDocumentIds.includes(doc.id);
        });
        this.cd.detectChanges();
      }
    }, error => {
      console.error('Error fetching tracking data:', error);
    });
  }
}
