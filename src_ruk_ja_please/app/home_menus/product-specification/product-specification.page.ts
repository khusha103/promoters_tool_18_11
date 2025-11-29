import { Component, OnInit } from '@angular/core';
import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';
import { Browser } from '@capacitor/browser';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-product-specification',
  templateUrl: './product-specification.page.html',
  styleUrls: ['./product-specification.page.scss'],
})
export class ProductSpecificationPage implements OnInit {
  icons: { 
    id: number; 
    imageUrldark: string; 
    imageUrllight: string; 
    isActive: boolean; 
  }[] = [];

  darkCategories: any[] = [];
lightCategories: any[] = [];
  
  // icons: { id: number; imageUrl: string; isActive: boolean }[] = []; // Dynamic icons with IDs
  contents: any[] = []; // Placeholder for content, will be fetched dynamically
  selectedContent: any = null; // Default selected content
  categories: any[] = []; // Fetched categories

  constructor(private iab: InAppBrowser, private apiService: ApiService) {}

  ngOnInit() {
    this.fetchAllCategories(); // Fetch categories for dynamic icons
  }

  fetchAllCategories() {


    this.apiService.getCategoryDark().subscribe(
      (darkResponse) => {
        if (darkResponse.status) {
          this.darkCategories = darkResponse.data;
  
          this.apiService.getCategoryLight().subscribe(
            (lightResponse) => {
              if (lightResponse.status) {
                this.lightCategories = lightResponse.data;
  
                // Combine dark and light categories by matching IDs
                this.icons = this.darkCategories.map((darkCat: any, index: number) => {
                  const lightCat = this.lightCategories.find((lc: any) => lc.id === darkCat.id);
  
                  return {
                    id: darkCat.id,
                    imageUrldark: darkCat.image,
                    imageUrllight: lightCat ? lightCat.image : '', // fallback to empty if not found
                    isActive: index === 0,
                  };
                });
  
                console.log('Dynamic icons loaded with dark and light images:', this.icons);
  
                // Automatically select first icon as before
                if (this.icons.length > 0) {
                  this.selectIcon(0);
                }
              } else {
                console.error('Failed to fetch light categories:', lightResponse.message);
              }
            },
            (error) => console.error('Error fetching light categories:', error)
          );
        } else {
          console.error('Failed to fetch dark categories:', darkResponse.message);
        }
      },
      (error) => console.error('Error fetching dark categories:', error)
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
          const apiButtons = response.data.map((item: { productspec_title_en: string; url: string }) => ({
            title: item.productspec_title_en,
            url: item.url,
          }));
  
          // Static images
          const predefinedImages = [
            '/assets/icon/Sony-65-Inch-Smart-TV.png',
            '/assets/icon/productspecification2.png',
            '/assets/icon/productspecification3.png',
            '/assets/icon/productspecification4.png',
            '/assets/icon/productspecification3.png'
          ];
  
          // Get index and category title from darkCategories
          const selectedIndex = this.darkCategories.findIndex(cat => cat.id === categoryId);
          const selectedCategory = this.darkCategories[selectedIndex];
  
          if (selectedIndex !== -1 && selectedCategory) {
            this.selectedContent = {
              imageUrl: predefinedImages[selectedIndex] || '', // Static image
              title: selectedCategory.category_name,           // Title from darkCategories
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
  
  
  

  // openInAppBrowser(url: string) {
  //   const browser = this.iab.create(url, '_blank', {
  //     hidden: 'no',
  //     hardwareback: 'yes',
  //     fullscreen: 'no',
  //   });
  // }

  // Method to open a URL in the in-app browser with customization
 async openInAppBrowser(url: string) {
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
