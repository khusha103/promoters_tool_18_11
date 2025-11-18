import { Component, OnInit } from '@angular/core';
import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-product-specification',
  templateUrl: './product-specification.page.html',
  styleUrls: ['./product-specification.page.scss'],
})
export class ProductSpecificationPage implements OnInit {
  icons: { id: number; imageUrl: string; isActive: boolean }[] = []; // Dynamic icons with IDs
  contents: any[] = []; // Placeholder for content, will be fetched dynamically
  selectedContent: any = null; // Default selected content
  categories: any[] = []; // Fetched categories

  constructor(private iab: InAppBrowser, private apiService: ApiService) {}

  ngOnInit() {
    this.fetchAllCategories(); // Fetch categories for dynamic icons
  }

  fetchAllCategories() {
    this.apiService.getAllCategories().subscribe(
      (response) => {
        if (response.status) {
          this.categories = response.data; // Store fetched categories

          // Dynamically populate icons with category ID and image
          this.icons = this.categories.map((category: any, index: number) => ({
            id: category.id, // Store category ID for reference
            imageUrl: category.image,
            isActive: index === 0, // Set the first icon as active by default
          }));

          console.log('Dynamic icons loaded:', this.icons);

          // Automatically fetch data for the first category
          if (this.icons.length > 0) {
            this.selectIcon(0);
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

  selectIcon(index: number) {
    this.icons.forEach((icon, i) => {
      icon.isActive = i === index; // Mark the clicked icon as active
    });

    const selectedCategoryId = this.icons[index].id; // Get the selected category ID
    this.fetchCategoryData(selectedCategoryId); // Fetch category-specific data
  }

  fetchCategoryData(categoryId: number) {
    this.apiService.getProductspecByCategory(categoryId).subscribe(
      (response) => {
        if (response.status) {
          // Map product specifications to buttons dynamically
          const apiButtons = response.data.map((item: { productspec_title_en: string; url: string }) => ({
            title: item.productspec_title_en,
            url: item.url,
          }));
  
          // Maintain the static images you've already set
          const predefinedImages = [
            '/assets/icon/Sony-65-Inch-Smart-TV.png',
            '/assets/icon/productspecification2.png',
            '/assets/icon/productspecification3.png',
            '/assets/icon/productspecification4.png',
            '/assets/icon/productspecification3.png'
          ];
  
          // Find the index based on the selected category ID
          const selectedIndex = this.categories.findIndex(cat => cat.id === categoryId);
  
          if (selectedIndex !== -1) {
            this.selectedContent = {
              imageUrl: predefinedImages[selectedIndex], // Use predefined static image
              title: this.categories[selectedIndex].category_name, // Use dynamic category name from API
              buttons: apiButtons,
            };
          }
  
          console.log('Selected content updated:', this.selectedContent);
        } else {
          console.error('Failed to fetch products:', response.message);
        }
      },
      (error) => {
        console.error('API error:', error);
      }
    );
  }
  
  

  openInAppBrowser(url: string) {
    const browser = this.iab.create(url, '_blank', {
      hidden: 'no',
      hardwareback: 'yes',
      fullscreen: 'no',
    });
  }


//   newCategoryName = '';
// newCategoryImage = '';

// addNewCategory() {
//   const newId = this.categories.length + 1;
//   this.categories.push({
//     id: newId,
//     category_name: this.newCategoryName,
//     image: this.newCategoryImage
//   });

//   this.icons = this.categories.map((category, index) => ({
//     id: category.id,
//     imageUrl: category.image,
//     isActive: false
//   }));

//   console.log('Categories after adding new one:', this.categories);
//   this.newCategoryName = '';
//   this.newCategoryImage = '';
// }

}
