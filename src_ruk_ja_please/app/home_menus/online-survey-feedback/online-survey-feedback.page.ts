import { Component, OnInit } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';
import { ApiService } from 'src/app/services/api.service';
import { UserService } from 'src/app/services/user.service';


@Component({
  selector: 'product-salestalk',
  templateUrl: './online-survey-feedback.page.html',
  styleUrls: ['./online-survey-feedback.page.scss'],
})
export class OnlineSurveyFeedbackPage implements OnInit {
  icons: { 
    id: number; 
    imageUrldark: string; 
    imageUrllight: string; 
    isActive: boolean; 
  }[] = [];

  darkCategories: any[] = [];
lightCategories: any[] = [];
  isLoading: boolean = true;
  items: Array<string> = [];
  activeCategoryId: number | null = 1; // Track the active category

  SurveyForms: any[] = [];
  serviceRelatedPdfs: any[] = [];
  countries: any[] = [];
  countryId: number = 0; 
  lang: string = 'en'; 
  documentPdfs: any[] = [];
  videoPdfs: any[] = [];
  selectedCategory!: number;
  categories: any[] = [];
  category_name: any
  constructor(private apiservice:ApiService,private userService:UserService,private iab: InAppBrowser) {}

  ngOnInit() {
    this.fetchAllCategories();
    this.loadCategorywiseSurveyData(1); // Load data for category 1 (Televisions) by default

    // this.loadSurveys();
    this.fetchAllCountries();
    this.fetchUserData(); //fetch userdata from login
    
  }



  fetchUserData() {
    const userIdString = localStorage.getItem('userId');
    const userId = userIdString ? Number(userIdString) : null;

    if (userId !== null) {
      this.userService.fetchUserData(userId).subscribe(
        (response) => {
          if (response.status) {
            this.setUserData(response.data);

          } else {
            console.error('Failed to fetch user data:', response.message);
          }
        },
        (error) => {
          console.error('Error fetching user data:', error);
        }
      );
    }
  }

  setUserData(userData: any) {
    const country = this.countries.find(c => c.name === userData.countryname);
    if (country) {
      this.countryId = country.id;
      // this.onCountryChange();
      this.loadCategorywiseSurveyData(1); // Load data for category 1 (Televisions) by default
    }
  }


  fetchAllCountries() {
    this.apiservice.getAllCountries().subscribe(
      (response) => {
        this.countries = response.data;
      },
      (error) => {
        console.error('Error fetching countries:', error);
      }
    );
  }
  //  // Define fixed titles and images for each category
  //  fixedCategories: { [key: number]: { title: string; imageUrl: string ;bannerImageUrl:string} } = {
  //   1: { title: 'TELEVISIONS', imageUrl: '/assets/icon/Productspageicons/tc.svg' ,bannerImageUrl: '/assets/icon/Sony-65-Inch-Smart-TV.png'},
  //   2: { title: 'DIGITAL IMAGING', imageUrl: '/assets/icon/Productspageicons/camera.svg',bannerImageUrl: '/assets/icon/productspecification2.png' },
  //   3: { title: 'PERSONAL AUDIO', imageUrl: '/assets/icon/Productspageicons/headphone.svg',bannerImageUrl: '/assets/icon/productspecification3.png' },
  //   4: { title: 'HOME AUDIO Video', imageUrl: '/assets/icon/Productspageicons/hav.svg' ,bannerImageUrl: '/assets/icon/productspecification4.png'},
  //   5: { title: 'Personal Audio Speaker', imageUrl: '/assets/icon/Productspageicons/speaker.svg' ,bannerImageUrl: '/assets/icon/productspecification4.png'}
  // };

  // Define fixed titles and images for each category
  fixedCategories: { [key: number]: { title: string; imageUrl: string; bannerImageUrl: string } } = {
    1: { title: '', imageUrl: '', bannerImageUrl: '/assets/icon/Sony-65-Inch-Smart-TV.png' },
    2: { title: '', imageUrl: '', bannerImageUrl: '/assets/icon/productspecification2.png' },
    3: { title: '', imageUrl: '', bannerImageUrl: '/assets/icon/productspecification3.png' },
    4: { title: '', imageUrl: '', bannerImageUrl: '/assets/icon/productspecification4.png' },
    5: { title: '', imageUrl: '', bannerImageUrl: '/assets/icon/productspecification4.png' }
  };
  


   // Method to change category
 changeCategory(categoryId: number): void {
  // console.log(categoryId);
  this.activeCategoryId = categoryId; // Set the active category
  
  this.loadCategorywiseSurveyData(categoryId); // Load data for the selected category
}


// loadCategorywiseSurveyData(categoryId: number): void {
//   // console.log("cat id", categoryId);
//   this.selectedCategory = categoryId;
  
//   // Get category details from fixedCategories
//   const categoryDetails = this.fixedCategories[categoryId];

//   if (categoryDetails) {
//     // console.log("Category Title:", categoryDetails.title);
//     // console.log("Banner Image URL:", categoryDetails.bannerImageUrl);
//   } else {
//     console.error('Category not found');
//   }
//   const userIdString = localStorage.getItem('userId');
//   const userId = userIdString ? Number(userIdString) : null;

//   if (userId !== null) {
//   this.apiservice.getSurveys(this.countryId, categoryId, this.lang,userId).subscribe(
//     response => {
//       if (response.status) {
//         this.surveys = response.guidelines;
//         this.SurveyForms = response.guidelines;
//         // console.log("SurveyForms",this.SurveyForms);
     
//       } else {
//         console.error('No data found');
//         this.handleNoData() ;
//       }
//     },
//     error => {
//       console.error('Error fetching surveys', error);
//       this.handleError();
//     }
//   );
// }
// }

loadCategorywiseSurveyData(categoryId: number): void {
  this.selectedCategory = categoryId;

  // Get category details from fixedCategories
  const categoryDetails = this.fixedCategories[categoryId];

  if (categoryDetails) {
    // Optionally log category details for debugging
    console.log("Category Title:", categoryDetails);
    console.log("Banner Image URL:", categoryDetails.bannerImageUrl);
  } else {
    console.error('Category not found');
    return; // Exit if category details are not found
  }

  const userIdString = localStorage.getItem('userId');
  const userId = userIdString ? Number(userIdString) : null;
  const language = localStorage.getItem('lang') || 'en';

  if (userId !== null) {
    // Optionally show a loading indicator here
    // this.loading = true; // Assuming you have a loading property to manage UI state

    this.apiservice.getSurveys(this.countryId, categoryId, language, userId).subscribe(
      response => {
        // this.loading = false; // Hide loading indicator

        if (response.status) {
          this.surveys = response.guidelines;
          this.SurveyForms = response.guidelines;
          console.log("SurveyForms", this.SurveyForms);
        } else {
          console.error('No data found');
          this.handleNoData();
        }
      },
      error => {
        // this.loading = false; // Hide loading indicator on error
        console.error('Error fetching surveys', error);
        this.handleError();
      }
    );
  } else {
    console.warn('User ID is not available');
    this.handleNoData(); // Handle case where user ID is not found
  }
}

surveys: any[] = [];


// Optional: Define methods to handle specific cases
handleNoData() {
  // Logic to handle when no data is found
  // For example, show a message to the user
  alert("No guidelines available for the selected category.");
}

handleError() {
  // Logic to handle errors
  alert("An error occurred while fetching guidelines. Please try again later.");
}

openForm(url: string) {
  // this.iab.create(url, '_blank', 'location=no'); // Open in InAppBrowser

  const browser = this.iab.create(
    url,
    '_blank',
    {
      hidden: 'no',
      hardwareback: 'yes',
      fullscreen: 'no'
    }
  );
}

// fetchAllCategories() {

//   // const isDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
//   // const isDarkMode = document.body.classList.contains('dark');
//   // const isDarkMode = document.body.classList.contains('dark_pta');
//   // console.log("isDarkMode",isDarkMode)

//   // console.log(isDarkMode);
//   // const isDarkMode = true;
//   const isDarkMode = 1;
//   const categoryObservable = isDarkMode
//     ? this.apiservice.getCategoryDark()
//     : this.apiservice.getCategoryLight();

//   categoryObservable.subscribe(
//     (response) => {
//       if (response.status) {
//         this.categories = response.data.map((category: any, index: number) => ({
//           id: category.id,
//           title: category.category_name,
//           imageUrl: category.image,
//           isActive: index === 0
//         }));

//         console.log('Categories fetched:', this.categories);

//         if (this.categories.length > 0) {
//           this.changeCategory(this.categories[0].id);
//         }
//       } else {
//         console.error('Failed to fetch categories:', response.message);
//       }
//     },
//     (error) => {
//       console.error('Error fetching categories:', error);
//     }
//   );
// }


fetchAllCategories() {

  this.apiservice.getCategoryDark().subscribe(
    (darkResponse: any) => {
      if (darkResponse.status) {
        this.darkCategories = darkResponse.data;
  
        this.apiservice.getCategoryLight().subscribe(
          (lightResponse: any) => {
            if (lightResponse.status) {
              this.lightCategories = lightResponse.data;
              console.log('lightResponsesgjhg:',  this.lightCategories);
              this.category_name = this.lightCategories.map(item => item.category_name);

              this.icons = this.darkCategories.map((darkCat: any, index: number) => {
                const lightCat = this.lightCategories.find((lc: any) => lc.id === darkCat.id);
                return {
                  id: darkCat.id,
                  imageUrldark: darkCat.image,
                  imageUrllight: lightCat ? lightCat.image : '',
                  isActive: index === 0
                };
              });
  
              console.log('Dynamic icons loaded with dark and light images:', this.icons);
  
              if (this.icons.length > 0) {
                this.selectIcon(0);
              }
            } else {
              console.error('Failed to fetch light categories:', lightResponse.message);
            }
          },
          (error: any) => console.error('Error fetching light categories:', error)
        );
      } else {
        console.error('Failed to fetch dark categories:', darkResponse.message);
      }
    },
    (error: any) => console.error('Error fetching dark categories:', error)
  );
  
}

selectIcon(index: number) {
  this.icons.forEach((icon, i) => {
    icon.isActive = i === index;
  });

  const selectedCategoryId = this.icons[index].id;
  this.loadCategorywiseSurveyData(selectedCategoryId); // ✅ Pass the value only
}



}