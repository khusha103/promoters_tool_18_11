// import { Component, OnInit } from '@angular/core';
// import { Router } from '@angular/router';
// import { NavController } from '@ionic/angular';
// import { ApiService } from 'src/app/services/api.service';

// @Component({
//   selector: 'app-product-countertalk',
//   templateUrl: './product-countertalk.page.html',
//   styleUrls: ['./product-countertalk.page.scss'],
// })
// export class ProductCountertalkPage implements OnInit {
//   isLoading: { [key: string]: boolean } = {};
//   items: Array<string> = [];
//   activeCategoryId: number | null = 1;

//   constructor(private router: Router, private apiservice: ApiService, private navCtrl: NavController) { }

//   content: any[] = [];
//   fixedCategories: { [key: number]: { title: string; imageUrl: string } } = {
//     1: { title: 'TELEVISIONS', imageUrl: '/assets/icon/Productspageicons/tc.svg' },
//     2: { title: 'DIGITAL IMAGING', imageUrl: '/assets/icon/Productspageicons/camera.svg' },
//     3: { title: 'PERSONAL AUDIO', imageUrl: '/assets/icon/Productspageicons/headphone.svg' },
//     4: { title: 'HOME AUDIO', imageUrl: '/assets/icon/Productspageicons/speaker.svg' }
//   };

//   ngOnInit(): void {
//     this.loadCategoryData(1);
//   }

//   ionViewDidEnter() {
//     console.log('ion view loaded');
//   }

//   loadCategoryData(categoryId: number): void {
//     const heading = '1';

//     this.apiservice.getCategories(categoryId, heading).subscribe(
//       response => {
//         const categoryData = this.fixedCategories[categoryId];
//         this.content = [{
//           imageUrl: categoryData.imageUrl,
//           title: categoryData.title,
//           buttons: response.data.map((item: any) => {
//             const buttonId = `${item.id}-${item.category_id}`;
//             this.isLoading[buttonId] = true; // Set initial loading state for each image
//             return {
//               name: item.series_name,
//               image: item.series_image,
//               seriesid: item.id,
//               cat_id: item.category_id,
//               buttonId: buttonId
//             };
//           })
//         }];
//         console.log(this.content);
//       },
//       error => {
//         console.error('Error fetching categories:', error);
//       }
//     );
//   }

//   changeCategory(categoryId: number): void {
//     console.log(categoryId);
//     this.activeCategoryId = categoryId;
//     this.loadCategoryData(categoryId);
//   }

//   getImageUrl(imageName: string): string {
//     return `https://ekarigartech.com/erp/series_img/${imageName}`;
//   }

//   onSeriesClick(button: any) {
//     console.log('Series clicked:', button);
//     const sourcepage = "countertalk";
//     this.router.navigate(['/product-inner', button.name, button.image, button.seriesid, button.cat_id, sourcepage]);
//   }

//   onImageLoad(buttonId: string) {
//     this.isLoading[buttonId] = false;
//   }

//   onImageError(buttonId: string) {
//     console.error('Error loading image');
//     this.isLoading[buttonId] = false;
//   }
// }


import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';
import { environment } from 'src/environments/environment';
import { Subscription } from 'rxjs'; // Make sure this import is present

@Component({
  selector: 'app-product-countertalk',
  templateUrl: './product-countertalk.page.html',
  styleUrls: ['./product-countertalk.page.scss'],
})
export class ProductCountertalkPage implements OnInit {
  isLoading: { [key: string]: boolean } = {};
  activeCategoryId: number | null = null;
  categories: any[] = [];
  content: any[] = [];
  selectedCategoryTitle: string = '';
  isDataLoading: boolean = false; 
  noDataMessage: string = ''; 
  mutationObserver: MutationObserver | null = null;
  currentTheme: 'light' | 'dark' = 'light';
  categorySubscription: Subscription | null = null; // ✅ Add this line

  constructor(private router: Router, private apiservice: ApiService, private navCtrl: NavController) {
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
    this.fetchAllCategories();
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
    ? this.apiservice.getCategoryDark()
    : this.apiservice.getCategoryLight();

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
    this.isDataLoading = true;  
    this.noDataMessage = '';  

    const selectedCategory = this.categories.find(cat => cat.id === categoryId);
    if (selectedCategory) {
      this.selectedCategoryTitle = selectedCategory.title;
    }

    this.loadCategoryData(categoryId);
  }

  loadCategoryData(categoryId: number): void {
    const heading = '1';

    this.apiservice.getCategories(categoryId, heading).subscribe(
      (response) => {
        this.isDataLoading = false;  

        if (response.data.length > 0) {
          this.content = [{
            title: this.selectedCategoryTitle,  
            buttons: response.data.map((item: any) => {
              const buttonId = `${item.id}-${item.category_id}`;
              this.isLoading[buttonId] = true; 
              return {
                name: item.series_name,
                image: item.series_image,
                seriesid: item.id,
                cat_id: item.category_id,
                buttonId: buttonId
              };
            })
          }];
        } else {
          this.content = [];  
          this.noDataMessage = 'No data available for this category.';
        }
      },
      (error) => {
        console.error('Error fetching categories:', error);
        this.isDataLoading = false;
        this.noDataMessage = 'An error occurred while fetching data.';
      }
    );
  }

  getImageUrl(imageName: string): string {
    // return `https://ekarigartech.com/erp/series_img/${imageName}`;
    // return `https://ekarigartech.com/happy_pta/series_img/${imageName}`;
    return `${environment.apiBaseUrl}/series_img/${imageName}`;

  }

  onSeriesClick(button: any) {
    console.log('Series clicked:', button);
    const sourcepage = "countertalk";
    this.router.navigate(['/product-inner', button.name, button.image, button.seriesid, button.cat_id, sourcepage]);
  }

  onImageLoad(buttonId: string) {
    this.isLoading[buttonId] = false;
  }

  onImageError(buttonId: string) {
    console.error('Error loading image');
    this.isLoading[buttonId] = false;
  }
}
