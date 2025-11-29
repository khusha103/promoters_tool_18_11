// import { Component, OnInit } from '@angular/core';
// import { Router } from '@angular/router';

// @Component({
//   selector: 'app-online-exam-category',
//   templateUrl: './online-exam-category.page.html',
//   styleUrls: ['./online-exam-category.page.scss'],
// })
// export class OnlineExamCategoryPage implements OnInit {


//   // Define fixed titles and images for each category
//   fixedCategories: { [key: number]: { title: string; imageUrl: string } } = {
//     1: { title: 'TELEVISIONS', imageUrl: '/assets/icon/Productspageicons/tc.svg' },
//     2: { title: 'DIGITAL IMAGING', imageUrl: '/assets/icon/Productspageicons/camera.svg' },
//     3: { title: 'PERSONAL AUDIO', imageUrl: '/assets/icon/Productspageicons/headphone.svg' },
//     4: { title: 'HOME AUDIO', imageUrl: '/assets/icon/Productspageicons/speaker.svg' }
//   };

//   constructor(private router: Router) {}

//   ngOnInit() {}

//   selectCategory(categoryId: number) {
//     // Navigate to the online exam details page with the selected category ID
//     this.router.navigate(['/online-exam-details', { categoryId }]);
//   }

// }

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-online-exam-category',
  templateUrl: './online-exam-category.page.html',
  styleUrls: ['./online-exam-category.page.scss'],
})
export class OnlineExamCategoryPage implements OnInit {
  fixedCategories: { id: number; title: string; imageUrl: string }[] = [];
  currentTheme: 'light' | 'dark' = 'light';
  categorySubscription: Subscription | null = null;
  mutationObserver: MutationObserver | null = null;

  constructor(private router: Router, private apiService: ApiService) {}

  ngOnInit() {
    this.fetchAllCategories();
    setTimeout(() => {
      this.fetchAllCategories(); // first fetch after theme is applied
    }, 100);

    // 🔁 Detect theme class change (dark <-> light)
    this.mutationObserver = new MutationObserver(() => {
      const isDark = document.body.classList.contains('dark') || document.body.classList.contains('dark_pta');
      const detectedTheme: 'light' | 'dark' = isDark ? 'dark' : 'light';

      if (detectedTheme !== this.currentTheme) {
        console.log("Theme changed to:", detectedTheme);
        this.currentTheme = detectedTheme;
        this.fetchAllCategories(true); // re-fetch if theme changes
      }
    });

    this.mutationObserver.observe(document.body, {
      attributes: true,
      attributeFilter: ['class']
    });
  }

  ngOnDestroy() {
    if (this.mutationObserver) this.mutationObserver.disconnect();
    if (this.categorySubscription) this.categorySubscription.unsubscribe();
  }

  fetchAllCategories(forceRefresh: boolean = false) {
    const isDark = document.body.classList.contains('dark') || document.body.classList.contains('dark_pta');
    const newTheme: 'light' | 'dark' = isDark ? 'dark' : 'light';

    if (!forceRefresh && newTheme === this.currentTheme && this.fixedCategories.length > 0) {
      console.log("Theme unchanged, skipping reload.");
      return;
    }

    this.currentTheme = newTheme;
    const categoryObservable = this.currentTheme === 'dark'
      ? this.apiService.getCategoryDark()
      : this.apiService.getCategoryLight();

    if (this.categorySubscription) this.categorySubscription.unsubscribe();

    this.categorySubscription = categoryObservable.subscribe(
      (response) => {
        if (response.status) {
          this.fixedCategories = response.data.map((category: any) => ({
            id: category.id,
            title: category.category_name,
            imageUrl: category.image
          }));

          console.log('Loaded icons for theme:', this.currentTheme, this.fixedCategories);
        } else {
          console.error('Failed to fetch categories:', response.message);
        }
      },
      (error) => {
        console.error('Error fetching categories:', error);
      }
    );
  }
  selectCategory(categoryId: number) {
    this.router.navigate(['/online-exam-details', { categoryId }]);
  }
}

