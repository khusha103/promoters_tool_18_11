import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-planogram-feedback',
  templateUrl: './planogram-feedback.page.html',
  styleUrls: ['./planogram-feedback.page.scss'],
})
export class PlanogramFeedbackPage implements OnInit {
  icons: { id: string; name: string; imageUrl: string; isActive: boolean }[] = []; 


  constructor(private router: Router, private apiService: ApiService,private alertCtrl: AlertController) {}

  ngOnInit() {
    this.fetchAllCategories(); 
    
  }
currentTheme:string="";
categories = [];
  // fetchAllCategories() {
  //   this.apiService.getAllCategories().subscribe(
  //     (response) => {
  //       if (response.status) { 
  //         this.icons = response.data.map((category: any, index: number) => ({
  //           id: category.id,
  //           name: category.name, 
  //           imageUrl: category.image, 
            
  //         }));
  
  //         console.log('Dynamic icons loaded:', this.icons);
  //       } else {
  //         console.error('Failed to fetch categories:', response.message);
  //       }
  //     },
  //     (error) => {
  //       console.error('Error fetching categories:', error);
  //     }
  //   );
  // }

  fetchAllCategories(forceRefresh = false) {
  const isDarkMode =
    document.body.classList.contains('dark') ||
    document.body.classList.contains('dark_pta');
  const newTheme = isDarkMode ? 'dark' : 'light';

  if (
    !forceRefresh &&
    newTheme === this.currentTheme &&
    this.categories?.length > 0
  ) {
    console.log('No theme change & categories already loaded — skipping.');
    return;
  }

  this.currentTheme = newTheme;
  console.log('Fetching icons for theme:', this.currentTheme);

  const categoryObservable = isDarkMode
    ? this.apiService.getCategoryDark()
    : this.apiService.getCategoryLight();

  categoryObservable.subscribe(
    (response) => {
      if (response.status) {
        this.icons = response.data.map((category: any, index: number) => ({
          id: category.id,
          name: category.category_name,
          imageUrl: category.image,
          // isActive: index === 0,
        }));

        console.log('Dynamic icons loaded:', this.icons);
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
      icon.isActive = i === index; // Toggle active state
    });
  }

  // navigateToFeedbackForm(categoryId: string) {
  //   this.router.navigate(['/planogram-feedback-form', { categoryId }]);
  // }

  // navigateToFeedbackForm(categoryId: string) {

  //   this.router.navigate(['/planogram-feedback-form'], {
  //     queryParams: {categoryId: categoryId}
  //   }); 
  //   // if (categoryId !== '1') {
  //   //   this.showCategoryAlert();
  //   // } else {
  //   //   // this.router.navigate(['/planogram-feedback-form', { categoryId }]);
  //   //   // Navigate to planogram-area with query params
  //   //   this.router.navigate(['/planogram-feedback-form'], {
  //   //     queryParams: {categoryId: categoryId}
  //   //   });
  //   // }
  // }


  navigateToFeedbackForm(categoryId: string) {

    this.router.navigate(['/planogram-feedback-form'], {
      queryParams: {categoryId: categoryId}
    }); 
    
  }


  // navigateToFeedbackForm(categoryId: string) {
  //   this.router.navigate(['/planogram-feedback-form', { categoryId }]);
  // }
  

  navigateToFeedbackForm_WIP(categoryId: string) {
    
      this.showWIPAlert();
    
  }

  onIconClick(icon: any) {
    this.apiService.getCategoryStatus(icon).subscribe(
      (response: any) => {
        if (response.status) {
          // Navigate to feedback form if status is true

          console.log("resposne",response);
          this.navigateToFeedbackForm(icon);
        } else {
          // Show alert if areas are not added yet
          this.showAlert('Areas of this category are not added yet');
        }
      },
      (error) => {
        // Handle error (e.g., API request failure)
        this.showAlert('An error occurred. Please try again later.');
      }
    );
  }

   // Show alert with the given message
   async showAlert(message: string) {
    const alert = await this.alertCtrl.create({
      header: 'Information',
      message: message,
      buttons: ['OK']
    });
    await alert.present();
  }

  async showWIPAlert() {
    const alert = await this.alertCtrl.create({
      header: 'Information',
      message: 'Work in Progress',
      buttons: ['OK']
    });
  
    await alert.present();
  }
  
  async showCategoryAlert() {
    const alert = await this.alertCtrl.create({
      header: 'Information',
      message: 'These category areas are not added yet.',
      buttons: ['OK']
    });
  
    await alert.present();
  }
}
