import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { AlertController, NavController, Platform, ToastController } from '@ionic/angular';
import { UserService } from 'src/app/services/user.service';
import { AuthService } from 'src/app/services/auth.service';
import { PageTransferDataService } from 'src/app/services/page-transfer-data.service';
import { Location } from '@angular/common';
import { environment } from 'src/environments/environment';


export enum PageType {
  Feedback,
  Details,
  Results,
  ConfirmResults
}

@Component({
  selector: 'app-planogram-feedback-form',
  templateUrl: './planogram-feedback-form.page.html',
  styleUrls: ['./planogram-feedback-form.page.scss'],
})
export class PlanogramFeedbackFormPage implements OnInit, OnDestroy {
  selectedDate: string = '';
  areas: any[] = []; // Array to hold area objects
  feedback: string = '';
  categoryId: string | null = null; // Variable to hold the category ID
  // categoryId: number=0; // Variable to hold the category ID

  products: any[] = [];
  area_title: any;
  get_feedback_id:string ="";

  // selectedAreas: string[] = []; // Areas selected by user
  selectedAreas: { name: string; id: number }[] = [];

  selectedTemplate: SafeHtml | null = null;
  selectedhtmltemplate: any;
  layoutImage: string | null = null;
  showDetails: boolean = false;
  showResults: boolean = false;
  updatedTemplate: any;
  area_planograms: any[] = [];
  originalInputValues: { [key: string]: any } = {};
  area_id: any;
  showconfirmresultpage: boolean = false;
  selectedArea_Template: any;
  selectedProduct: any;
  selectedAreaIndex: number | null = null;
  userId!: number;
  alloutlets: any[] = [];
  allretailers: any[] = [];
  useroutlet: any;
  update_case:boolean = false;

  areapage_ct:string = "";
  areapage_store:string = "";

  inputValues: { [key: string]: any } = {};

  // Expose PageType as a public property
  public PageType = PageType;
  currentPage: PageType = PageType.Feedback;


  constructor(private activatedRoute: ActivatedRoute,
    private apiService: ApiService,
    private sanitizer: DomSanitizer,
    private platform: Platform,
    private router: Router,
    private alertController: AlertController,
    private userService: UserService,
    private toastController: ToastController,
    private authservice: AuthService,
    private dataService: PageTransferDataService,
    private navCtrl: NavController,
    private location: Location,
  ) {
    
  }

 
  // textValue:any;
  // sendData() {
  //   this.dataService.setTextData(this.textValue);
  //   this.router.navigate(['/planogram-area']);  // Navigate to next page
  // }

  async handleBackClick() {
    const alert = await this.alertController.create({
      header: 'Confirm Back',
      // message: 'Do you want to go back? Unsaved changes may be lost.',
      message: 'Final feedback submission will not be saved.',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Yes',
          handler: () => {
            this.navCtrl.back();
             // Navigate back in history
             this.router.navigate(['/home']);
          // this.location.back(); // Go back one level in history
           
          },
        },
      ],
    });

    await alert.present();
  }

  // handleBackClick() {
  //   switch (this.currentPage) {
  //     case PageType.Details:
  //       // Move to Feedback page
  //       this.currentPage = PageType.Feedback;
  //       break;

  //     case PageType.Results:
  //       // Move to Details page
  //       this.currentPage = PageType.Details;
  //       break;

  //     case PageType.ConfirmResults:
  //       // Move to Feedback page
  //       this.currentPage = PageType.Feedback;
  //       break;

  //     case PageType.Feedback:
  //       // Navigate to planogram-feedback router page
  //       // this.router.navigate(['/planogram-feedback']);
  //       break;

  //     default:
  //       console.error('Unknown page type');
  //   }
  // }
  usertype: any;
  private backButtonSubscription: any;

  ngOnInit() {


    // this.platform.backButton.subscribeWithPriority(10, () => {
    //   this.handleBackClick();
    // });

    // Handle back button press every time user enters the page
    this.backButtonSubscription = this.platform.backButton.subscribeWithPriority(10, () => {
      this.handleBackClick();
    });
    
    this.getUserRole();

    this.activatedRoute.queryParams.subscribe(params => {
      this.get_feedback_id = params['fid'] || "";
    });
    if(this.get_feedback_id !== ""){
    this.update_case = true;
    }

    // console.log(this.update_case);
  }

  ngOnDestroy() {
    // Remove back button subscription when leaving the page
    if (this.backButtonSubscription) {
      this.backButtonSubscription.unsubscribe();
    }
  }

  ionViewWillEnter() {
    this.getUserRole();

    this.activatedRoute.queryParams.subscribe(params => {
      this.get_feedback_id = params['fid'] || "";
    });
    if(this.get_feedback_id !== ""){
    this.update_case = true;
    this.loadUniqueAreas();
    }

    // console.log(this.update_case);
  }

  // ng on view change check activeroueter fid is nonempty then restrict to delete areas if have  subitted data + readpnly catergory and retailer

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
            this.lang = response.data.user_lang;
            //when get roleid then call methods
            this.intializeapp();
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
  uniqueAreas:any;
  loadUniqueAreas() {
    this.apiService.getUniqueAreasByFeedback(+this.get_feedback_id).subscribe({
      next: (response) => {
        if (!response.error) {
          // console.log(response.data);
          this.uniqueAreas = response.data;
        } else {
          console.error('API Error:', response.message);
        }
      },
      error: (err) => {
        console.error('HTTP Error:', err);
      }
    });
  }

  intializeapp() {
    this.get_feedback_id = "";
    // Check the value in local storage
    const appSelector = localStorage.getItem('app_selection');
    // Conditional assignment based on app-selection value
    this.usertype = appSelector === '1' ? "1" : "2"; // Set usertype to "1" or "2"

    const userIdString = localStorage.getItem('userId');
    this.userId = userIdString ? Number(userIdString) : 0;
    this.fetchAllCountries();
    this.fetchAllCategories();

    // this.fetchUserData();
    this.fetchAllRetailers();
    this.fetchAllOutlets();

   

    this.activatedRoute.queryParams.subscribe(params => {
    
      this.categoryId = params['categoryId'] || 0;
      if (this.categoryId) {
            this.fetchCategoryData(this.categoryId);
            const category = Number(this.categoryId);
            this.fetchProductsByCategory(category);
          }

          console.log(this.categoryId);
    });

  }

  //check user related outlet and cat

  fetchAllCategories() {
    this.apiService.getAllCategories().subscribe(
      (response) => {
        if (response.status) { // Assuming your API response has a status field
          this.categories = response.data; // Store the fetched categories
        } else {
          console.error('Failed to fetch categories:', response.message);
        }
      },
      (error) => {
        console.error('Error fetching categories:', error);
      }
    );
  }

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

  countries: any[] = [];
  retailers: any[] = [];
  // alloutlets: any[] = [];
  // allretailers: any[] = [];
  // useroutlet: any;
  usercategory: any;

  outlets: any[] = [];
  categories: any[] = [];
  // selectedProduct: any;
  // products: any[] = [];

  selectedCountry: any;
  selectedRetailer: any;
  selectedOutlet: any;
  selectedCategory: any;

  categoryOptions = {
    header: 'Select Category'
  };

  countryOptions = {
    header: 'Select Country'
  };

  retailerOptions = {
    header: 'Select Retailer'
  };

  storeOptions = {
    header: 'Select Store'
  };



  hpuserData: any = {}; // Initialize userData
  cnt_data:any;

  fetchhpUser() {
    const userIdString = localStorage.getItem('userId'); // Retrieve user ID from local storage as a string
    if (userIdString) {
      const userId = parseInt(userIdString); // Convert user ID to a number
      this.apiService.getUserById(userId).subscribe(
        response => {
          if (response.status) {
            this.hpuserData = response.data; // Assign the fetched data to userData
            // console.log(this.hpuserData);
            const countryname = response.data.countryname
            const countryId = this.countries.find(c => c.name === countryname);
            console.log("countryId", countryId);

            // this.selectedCountry = countryId;
            // this.areapage_ct = this.selectedCountry.id;
            // console.log("ct",this.selectedCountry);

             //now preselcted hp user country from multiple countries
            
             this.selectedCountry = Number(localStorage.getItem('cnt_wip'));
             console.log(this.selectedCountry);
 
 
             this.apiService.getCountryData(this.selectedCountry).subscribe(
               (response) => {
                 this.selectedCountry = response['0'];
                 console.log(this.cnt_data);
                 console.log('Country Data:', this.countries);
 
                 if (this.selectedCountry) {
                   this.fetchRetailersByCountry(this.selectedCountry.id);
                 }
     
               },
               (error) => {
                 console.error('Error fetching country data:', error);
               }
             );

            // if (this.selectedCountry) {
            //   this.fetchRetailersByCountry(this.selectedCountry.id);
            // }

            console.log(this.hpuserData);
          } else {
            console.error('User not found');
          }
        },
        error => {
          console.error('Error fetching user data', error);
        }
      );
    }
  }

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
      this.fetchOutletsByRetailerAndCountry(this.selectedRetailer.id, this.selectedCountry.id);
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

  // async onCategoryChange(categoryId: number) {
  //   if (categoryId) {
  //     // console.log("catid on change",categoryId);

  //     this.usercategory = categoryId;

  //     this.fetchProductsByCategory(categoryId);
  //   } else {
  //     // Reset all dependent dropdowns if no category is selected
  //     this.usercategory = null;
  //   }
  // }

  fetchUserData() {
    const userIdString = localStorage.getItem('userId');
    const userId = userIdString ? Number(userIdString) : null;
    // const roleId = localStorage.getItem('roleId');
    const roleId = this.roleId;


    if (userId !== null) {
      // Check if roleId is '1' (superadmin)
      if (roleId === '1') {
        console.log('Superadmin detected');
      } else if (roleId === '4') {
        console.log('country pic detected');
      } else {
        this.userService.fetchUserData(userId).subscribe(
          (response) => {
            // Check if response is valid and has a message property
            if (response && response.status) {
              this.setUserData(response.data);
            } else {
              console.error('Failed to fetch user data:', response?.message || 'Unknown error');
            }
          },
          (error) => {
            console.error('Error fetching user data:', error);
          }
        );
      }
    } else {
      console.warn('No user ID found in local storage.');
    }
  }


  setUserData(userData: any) {
    // console.log(userData);
    const retailerId = this.allretailers.find(r => r.name === userData.retailer_name); // Get retailer ID

    if (retailerId.id) {
      // Filter outlets based on the retailer ID
      const outlet = this.alloutlets.find(o => o.report_name === userData.store_name && o.retailer_id === retailerId.id);
      if (outlet) {
        this.useroutlet = outlet.id;
        // console.log("storeid",this.useroutlet);

      } else {
        console.log('No matching outlet found for the given store name and retailer ID');
      }
    } else {
      console.log('No matching retailer found for the given retailer name');
    }
  }



  //use in case of promoters only
  fetchAllOutlets() {
    this.apiService.getAllOutlets().subscribe(
      (response) => {
        this.alloutlets = response.data;
        // console.log(this.alloutlets);
        // this.fetchUserData();
        // Check the value in local storage
        const appSelector = localStorage.getItem('app_selection');
        // console.log(appSelector);

        // Conditional call based on app-selector value
        if (appSelector === '1') {
          this.fetchUserData(); // Call fetchUserData if app-selector is 1
        } else {
          // hp user data
          this.fetchhpUser();
        }
      },
      (error) => {
        console.error('Error fetching outlets:', error);
      }
    );
  }
  //use in case of promoters only
  fetchAllRetailers() {
    this.apiService.getAllRetailers().subscribe(
      (response) => {
        this.allretailers = response.data;
        // console.log(this.allretailers);
      },
      (error) => {
        console.error('Error fetching Retailers:', error);
      }
    );
  }

  fetchProductsByCategory(categoryId: number) {
    this.apiService.getProductsByCategory(categoryId).subscribe(
      (response) => {
        if (response.status) {
          this.products = response.data; // Store fetched products
          // console.log(this.products);
        } else {
          console.error('Failed to fetch products:', response.message);
        }
      },
      (error) => {
        console.error('Error fetching products:', error);
        this.products = []; // Reset products if an error occurs
      }
    );
  }

  // onProductSelected(productId: any) {
  //   // console.log('Selected Product ID:', productId);
  //   this.selectedProduct = productId.id;
  // }

  fetchCategoryData(categoryId: string) {
    this.apiService.getCategoryplanograms(categoryId).subscribe(response => {
      if (!response.error) {
        // console.log(response);

        // Store the entire area data with formatted layout images
        this.areas = response.data.map((area: {
          id: number;
          layout_image: string;
          template: string;
          name: string;
          sony_inputs: string;
          other_inputs: string;
          shelf_inputs: string;
        }) => ({
          ...area,
          // layout_image: `https://ekarigartech.com/happyproject/planograms/${area.layout_image}`, // Prepend base URL
          layout_image: `${environment.apiBaseUrl}/planograms/${area.layout_image}`, // Prepend base URL

        }));

        // console.log('Areas:', this.areas); // Log areas for debugging
      } else {
        console.error('Error fetching category data:', response.message);
      }
    }, error => {
      console.error('API Error:', error);
    });
  }



  // async addArea(event: any) {
  //   // console.log(event.detail.value);
  //   await this.beforenavigateAreaSelect();
  //   console.log("pahuch gya ");//want return if missing something
 
  //   const areaName = event.detail.value.name;
  //   const areaId = event.detail.value.id;
  //   // console.log("event value", event.detail.value);

  //   this.selectedAreaIndex = areaId; // Update the selected area index
  //   const selectedAreaData = this.areas.find(area => area.name === areaName); // Get selected area object
  //   // console.log(selectedAreaData);

  //   // Check if selected area data exists and area is not already in selectedAreas
  //   const areaExists = this.selectedAreas.some(area => area.name === areaName);

  //   if (selectedAreaData && !areaExists) {
  //     // Add both areaName and areaId as an object to selectedAreas
  //     this.selectedAreas.push({ name: areaName, id: areaId });
  //     // console.log("Added area:", { name: areaName, id: areaId });

  //     // Set the corresponding template and layout image
  //     this.selectedTemplate = this.sanitizer.bypassSecurityTrustHtml(selectedAreaData.template); // Sanitize the template
  //     this.layoutImage = selectedAreaData.layout_image; // Set the layout image

  //     // Reset input values
  //     this.inputValues = {};

 
  //     this.viewSelectedArea(event.detail.value);
      
  //   } else {
  //     console.log("Area already selected or not found.");
  //   }
  // }

  // beforenavigateAreaSelect(){
  //   // console.log("areaparams", areaparams);

  //   // const areaId = areaparams.id;
  //   const cat_id = this.categoryId;

  //   console.log("seected areacatid",cat_id);

  //    // Check the value in local storage
  //    const appSelector = localStorage.getItem('app_selection');
  //   //  this.areastore = this.useroutlet;
  //   //  const store_id = this.useroutlet;

  //   this.activatedRoute.queryParams.subscribe(params => {
  //     this.get_store_id = params['storeId'] || "";
  //   });

  //   if(this.get_store_id !== ""){
  //     this.areastore = this.get_store_id;
  //   }else{
  //     if(appSelector === '1'){
  //       // const store_id = this.useroutlet;
  //        this.areastore = this.useroutlet;
  //       }else{
  //         // const store_id = this.selectedOutlet?.id;
  //        this.areastore = this.selectedOutlet?.id;
    
  //       }
  //       // const feedback = this.feedback;
  //   }
    

  //   this.dataService.setTextData(this.feedback);
  //   // this.router.navigate(['/planogram-area']);  

  //   const store_id = this.areastore;
  //   // console.log("areadata", areaId);
  //   console.log("areadata", cat_id);
  //   console.log("areadata", store_id);

  //   //get from url if get fid from slides page
  //   // this.route.queryParams.subscribe(params => {
  //   //   this.get_feedback_id = params['fid'] || "";
  //   // })

  //   this.activatedRoute.queryParams.subscribe(params => {
  //     this.get_feedback_id = params['fid'] || "";
  //   });

  //   const fid = this.get_feedback_id;
  //   // Check if any required field is missing
  //   let missingFields = [];
  //   // if (!areaId) missingFields.push("Area");
  //   if (!cat_id) missingFields.push("Category");
  //   if (!store_id) missingFields.push("Store");

  //   if (missingFields.length > 0) {
  //     // Show Ionic alert with missing fields
  //     this.showAlert("Missing Information", `Please select the following:\n${missingFields.join(", ")}`);
  //     return;
  //   } 
  // }

  async addArea(event: any) {
    // Ensure required fields are available before proceeding
    const canProceed = await this.beforenavigateAreaSelect();
    if (!canProceed) {
      console.log("Required fields are missing. Area will not be added.");
      return; // Stop execution if something is missing
    }
   

  
    console.log("pahuch gya "); // Debugging statement
  
    const areaName = event.detail.value.name;
    const areaId = event.detail.value.id;
    const catid = this.categoryId;
    // if(this.categoryId)
    const check2 = await this.fetchPlanogramAreas(areaId, catid);
    if (!check2) {
      console.log("Slides for this are not available");
      return; // Stop execution if something is missing
    }
  
    this.selectedAreaIndex = areaId; // Update the selected area index
    const selectedAreaData = this.areas.find(area => area.name === areaName); // Get selected area object
  
    // Check if selected area data exists and area is not already in selectedAreas
    const areaExists = this.selectedAreas.some(area => area.name === areaName);
  
    if (selectedAreaData && !areaExists) {
      // Add both areaName and areaId as an object to selectedAreas
      this.selectedAreas.push({ name: areaName, id: areaId });
  
      // Set the corresponding template and layout image
      this.selectedTemplate = this.sanitizer.bypassSecurityTrustHtml(selectedAreaData.template); // Sanitize the template
      this.layoutImage = selectedAreaData.layout_image; // Set the layout image
  
      // Reset input values
      this.inputValues = {};
  
      this.viewSelectedArea(event.detail.value);
    } else {
      console.log("Area already selected or not found.");
    }
  }
  
  async beforenavigateAreaSelect(): Promise<boolean> {
    const cat_id = this.categoryId;
    console.log("Selected category ID:", cat_id);
  
    // Get store_id from localStorage or query params
    const appSelector = localStorage.getItem('app_selection');
  
    this.activatedRoute.queryParams.subscribe(params => {
      this.get_store_id = params['storeId'] || "";
    });
  
    if (this.get_store_id !== "") {
      this.areastore = this.get_store_id;
    } else {
      this.areastore = appSelector === '1' ? this.useroutlet : this.selectedOutlet?.id;
    }
  
    const store_id = this.areastore;
    console.log("Store ID:", store_id);
  
    this.activatedRoute.queryParams.subscribe(params => {
      this.get_feedback_id = params['fid'] || "";
    });
  
    const fid = this.get_feedback_id;
  
    // Check if any required field is missing
    let missingFields = [];
    if (!cat_id) missingFields.push("Category");
    if (!store_id) missingFields.push("Store");
  
    if (missingFields.length > 0) {
      // Show Ionic alert with missing fields
      await this.showAlert("Missing Information", `Please select the following:\n${missingFields.join(", ")}`);
      return false; // Return false to prevent adding the area
    }
  
    return true; // Return true if all required fields are present
  }

  
  // async fetchPlanogramAreas(areaId :any,catid: any) : Promise<boolean>{
  //   this.apiService.getPlanogramAreaImages(catid, +areaId).subscribe((response) => {
  //     if (response.status && response.data) {
  //       // this.planogramAreas = response.data;
  //       // console.log("Planogram Areas", this.planogramAreas);
  
  //       // this.feedbackList = this.planogramAreas.map(() => ({
  //       //   feedbackItems: this.getDefaultFeedbackItems(),
  //       // }));
  //       return true;
  //     } else {
  //       console.log("No planogram areas found:", response.message);
  //       // this.planogramAreas = [];
  //       // this.feedbackList = [];
        
  //       await this.showAreaAlert("No Data", response.message || "No planogram areas available.");
  //       return false;
  //     }
  //   }, (error) => {
  //     console.error("Error fetching planogram areas:", error);
  //     await this.showAreaAlert("No Data", "No planogram areas available.");
  //     return false;
  //   });
  // }

  async fetchPlanogramAreas(areaId: any, catid: any): Promise<boolean> {
    try {
      const response = await this.apiService.getPlanogramAreaImages(catid, +areaId).toPromise();
  
      if (response.status && response.data) {
        // Handle successful response
        console.log("Planogram Areas", response.data);
        return true;
      } else {
        // If the response doesn't contain expected data, show an alert
        console.log("No planogram areas found:", response.message);
        await this.showAreaAlert("No Data", response.message || "No planogram areas available.");
        return false;
      }
    } catch (error) {
      // If an error occurs during the API request, handle it here
      console.error("Error fetching planogram areas:", error);
      await this.showAreaAlert("No Data", "No planogram areas slide(s) available.");
      return false;
    }
  }
  
  
  async showAreaAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: [
        {
          text: 'OK',
          handler: () => {
            // this.router.navigate(['/home']); // Navigate to the home page
            // this.BacktoFeedbackPage(); // Call the function instead of navigating directly
            // this.router.navigate(['/planogram-feedback-form']); // Navigate to home page
            // Navigate to planogram-area with query params
            // this.router.navigate(['/planogram-feedback-form'], {
            //   queryParams: { categoryId: this.categoryId, storeId: this.storeId, fid: this.get_feedback_id }
            // });
          }
        }
      ]
    });
    await alert.present();
  }
  
  // // Function to show an Ionic alert
  // async showAlert(header: string, message: string) {
  //   const alert = await this.alertController.create({
  //     header,
  //     message,
  //     buttons: ['OK']
  //   });
  //   await alert.present();
  // }
  


  // removeArea(index: number,areadId : number) {
  //   console.log();
  //   // Remove from selected areas
  //   const removedArea = this.selectedAreas.splice(index, 1)[0];
    
  // }

  async removeArea(index: number, areaId: number, event: Event) {
    event.stopPropagation(); // Prevent the event from bubbling up to the ion-item

    // Check if the areaId exists in the API response data
    const isFeedbackSaved = this.uniqueAreas.some((area: { area_id: string; }) => area.area_id === areaId.toString());
  
    // if (isFeedbackSaved) {
    //   // Show alert if area feedback is already saved
    //   alert('Area feedback already saved. Cannot remove.');
    // } else {
    //   // Remove the area if it's not restricted
    //   this.selectedAreas.splice(index, 1);
    // }
    if (isFeedbackSaved) {
      // Show Ionic Alert if area feedback is already saved
      const alert = await this.alertController.create({
        header: 'Cannot Remove',
        message: 'Area feedback already saved. You cannot remove this area.',
        buttons: ['OK']
      });
      await alert.present();
    } else {
      // Remove the area if it's not restricted
      this.selectedAreas.splice(index, 1);
    }
  }
  

  // removeArea(index: number,areadId : number) {
  //   console.log();
  //   // Remove from selected areas
  //   const removedArea = this.selectedAreas.splice(index, 1)[0];
  //   // console.log(removedArea);
  //   // console.log(this.area_planograms);


  //   if (removedArea) {
  //     // Reset selected template and layout image
  //     this.selectedTemplate = null;
  //     this.layoutImage = null;

  //     // Find and remove the corresponding template from area_planograms
  //     const templateIndex = this.area_planograms.findIndex((planogram: { planogramId: any; }) =>
  //       planogram.planogramId === removedArea.id // Assuming removedArea has a planogramId property
  //     );

  //     // console.log(templateIndex);

  //     if (templateIndex !== -1) {
  //       this.area_planograms.splice(templateIndex, 1); // Remove the found planogram
  //       console.log('Removed planogram index:', templateIndex);
  //     } else {
  //       console.log('No matching planogram found for removed area.');
  //     }
  //   }

  //   // console.log(this.area_planograms);

  // }
  // // viewSelectedArea(areaName: string) {
  //   viewSelectedArea(areaparams: { name: string; id: number }) {

  //     console.log("areaparams",areaparams);
  //     const areaId = areaparams.id;
  //     const cat_id = this.categoryId;
  //     const store_id = this.selectedOutlet.id;
  
     
  //     //when above is not undefined then navigate to  this.router.navigate(['/planogram-area']); else show alert store select area select and category not fetch
  
  //     console.log("areadata",areaId);
  //     console.log("areadata",cat_id);
  //     console.log("areadata",store_id);
  //   }
  areastore:any;
  get_store_id:string="";
  async viewSelectedArea(areaparams: { name: string; id: number }) {
    console.log("areaparams", areaparams);

    const areaId = areaparams.id;
    const cat_id = this.categoryId;

    console.log("seected areacatid",cat_id);

     // Check the value in local storage
     const appSelector = localStorage.getItem('app_selection');
    //  this.areastore = this.useroutlet;
    //  const store_id = this.useroutlet;

    this.activatedRoute.queryParams.subscribe(params => {
      this.get_store_id = params['storeId'] || "";
    });

    if(this.get_store_id !== ""){
      this.areastore = this.get_store_id;
    }else{
      if(appSelector === '1'){
        // const store_id = this.useroutlet;
         this.areastore = this.useroutlet;
        }else{
          // const store_id = this.selectedOutlet?.id;
         this.areastore = this.selectedOutlet?.id;
    
        }
        // const feedback = this.feedback;
    }
    

    this.dataService.setTextData(this.feedback);
    // this.router.navigate(['/planogram-area']);  

    const store_id = this.areastore;
    console.log("areadata", areaId);
    console.log("areadata", cat_id);
    console.log("areadata", store_id);

    //get from url if get fid from slides page
    // this.route.queryParams.subscribe(params => {
    //   this.get_feedback_id = params['fid'] || "";
    // })

    this.activatedRoute.queryParams.subscribe(params => {
      this.get_feedback_id = params['fid'] || "";
    });

    const fid = this.get_feedback_id;
    // Check if any required field is missing
    let missingFields = [];
    if (!areaId) missingFields.push("Area");
    if (!cat_id) missingFields.push("Category");
    if (!store_id) missingFields.push("Store");

    if (missingFields.length > 0) {
      // Show Ionic alert with missing fields
      this.showAlert("Missing Information", `Please select the following:\n${missingFields.join(", ")}`);
    } else {
      // Navigate to planogram-area with query params
      this.router.navigate(['/planogram-area'], {
        queryParams: { areaId, categoryId: cat_id, storeId: store_id ,fid:fid}
      });
    }
  }

  // Show Ionic Alert
  async showAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header: header,
      message: message,
      buttons: ['OK']
    });

    await alert.present();
  }



  // // viewSelectedArea(areaName: string) {
  // viewSelectedArea(areaparams: { name: string; id: number }) {

  //   console.log("areaparams",areaparams);
  //   const areaId = areaparams.id;
  //   const cat_id = this.categoryId;
  //   const store_id = this.selectedOutlet.id;

   
  //   //when above is not undefined then navigate to  this.router.navigate(['/planogram-area']); else show alert store select area select and category not fetch

  //   console.log("areadata",areaId);
  //   console.log("areadata",cat_id);
  //   console.log("areadata",store_id);




  //   // const areaName = areaparams.name;

  //   // // Find the selected area data
  //   // const selectedAreaData = this.areas.find(area => area.name === areaName);

  //   // if (!selectedAreaData) {
  //   //   this.currentPage = PageType.Details; // Navigate to details page if no area data found
  //   //   return;
  //   // }

  //   // // Set area-related data if selectedAreaData exists
  //   // this.area_id = selectedAreaData.id;
  //   // this.selectedhtmltemplate = selectedAreaData.template;
  //   // this.selectedTemplate = this.sanitizer.bypassSecurityTrustHtml(selectedAreaData.template);
  //   // this.layoutImage = selectedAreaData.layout_image;
  //   // this.area_title = areaName;

  //   // // Check if area_planograms array exists and contains the selected area ID
  //   // if (Array.isArray(this.area_planograms)) {
  //   //   const selectedPlanogram = this.area_planograms.find(
  //   //     (planogram: { planogramId: any }) => planogram.planogramId === this.area_id.toString()
  //   //   );

  //   //   this.showconfirmresultpage = !!selectedPlanogram;

  //   //   // If planogram exists, process the content and show the ConfirmResults page
  //   //   if (this.showconfirmresultpage) {
  //   //     this.selectedArea_Template = this.processTemplate(selectedPlanogram.content || '');
  //   //     this.currentPage = PageType.ConfirmResults;
  //   //   } else {
  //   //     this.currentPage = PageType.Details; // Navigate to details page
  //   //   }
  //   // } else {
  //   //   this.currentPage = PageType.Details; // Navigate to details page if area_planograms is not an array
  //   // }

  //   // // Reset input values
  //   // this.inputValues = {};

  //   // Log the final page state
  //   // console.log("showconfirmresultpage:", this.showconfirmresultpage);
  // }

  // Method to navigate back to Feedback page
  goBackfeedbackpage() {
    this.currentPage = PageType.Feedback;
  }

  getInputKeys(template: SafeHtml): string[] {
    // Updated regex to include 's' series keys
    const regex = /#(c\d+|s\d+|(\d+))#/g;
    const matches: string[] = [];
    let match;

    while ((match = regex.exec(template.toString())) !== null) {
      matches.push(match[1]);
    }

    // Sort to ensure 's' series first, then numbers, then 'c' series
    return matches.sort((a, b) => {
      if (a.startsWith('s') && !b.startsWith('s')) return -1; // 's' comes first
      if (!a.startsWith('s') && b.startsWith('s')) return 1;  // 's' comes first

      if (!isNaN(Number(a)) && isNaN(Number(b))) return -1; // Numbers come next
      if (isNaN(Number(a)) && !isNaN(Number(b))) return 1;  // Numbers come next

      if (a.startsWith('c') && !b.startsWith('c')) return 1; // 'c' comes last
      if (!a.startsWith('c') && b.startsWith('c')) return -1; // 'c' comes last

      return a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' });
    });
  }

  isNumber(value: string): boolean {
    return !isNaN(+value); // Convert to number and check if it's NaN
  }

  // Method to save input values
  saveInputs() {
    // Backup current input values
    this.originalInputValues = { ...this.inputValues };

    // You can perform validation here if needed
    const sSeriesData = this.getSValues();
    const cSeriesData = this.getCValues();
    const numberSeriesData = this.getNumberValues();

    // Example: Log the data to console (replace with actual saving logic)
    // console.log('S Series Values:', sSeriesData);
    // console.log('C Series Values:', cSeriesData);
    // console.log('Number Series Values:', numberSeriesData);

    // Process and log the updated template
    this.updatedTemplate = this.processTemplate(this.selectedhtmltemplate || '');
    // console.log('Updated Template:', this.updatedTemplate);

    // this.showResults = true; // Show results after processing
    // this.showDetails = false;
    this.currentPage = PageType.Results; // Go back to Results page
  }

  getSValues() {
    return Object.keys(this.inputValues)
      .filter(key => key.startsWith('s'))
      .reduce((acc: { [key: string]: any }, key) => {
        acc[key] = this.inputValues[key];
        return acc;
      }, {});
  }

  getCValues() {
    return Object.keys(this.inputValues)
      .filter(key => key.startsWith('c'))
      .reduce((acc: { [key: string]: any }, key) => {
        acc[key] = this.inputValues[key];
        return acc;
      }, {});
  }

  getNumberValues() {
    return Object.keys(this.inputValues)
      .filter(key => !isNaN(Number(key)))
      .reduce((acc: { [key: string]: any }, key) => {
        this.inputValues[key] = this.inputValues[key].name;
        acc[key] = this.inputValues[key];
        return acc;
      }, {});
  }

  processTemplate(template: string): SafeHtml {
    const processedHtml = template.replace(/#(c\d+|s\d+|\d+)#/g, (match) => {
      const value = this.inputValues[match.slice(1, -1)];
      // return value !== undefined ? value : "empty";
      return value !== undefined ? value : "";

    });

    return this.sanitizer.bypassSecurityTrustHtml(processedHtml); // Sanitize the output
  }


  confirm() {
    this.inputValues = { ...this.originalInputValues };
    const values = this.inputValues;
    const template = this.selectedhtmltemplate;
    const area_id = this.area_id//planogramId
    const plangram_content = this.replacePlaceholders(template, values);//content
    const newPlanograms = []; // Initialize an array to hold new planogram objects
    // Create a planogram object
    const planogram = {
      planogramId: area_id,
      content: plangram_content // Use the generated content
    };

    // Push the planogram object into the newPlanograms array
    newPlanograms.push(planogram);


    // Check if the existing planograms array exists on the instance
    if (!this.area_planograms) {
      this.area_planograms = []; // Initialize if it doesn't exist
    }

    // Append new planograms to the existing array
    this.area_planograms.push(...newPlanograms);

    // console.log(this.area_planograms); // Log the updated array of planograms for verification
    // this.showResults = false;
    // this.showDetails = false;
    this.currentPage = PageType.Feedback; // Go back to feedback page

  }



  replacePlaceholders(template: any, values: any) {
    // Replace dynamic numbered placeholders (#1#, #2#, #3#, ...)
    template = template.replace(/#(\d+)#/g, (match: any, p1: string | number) => {
      return values[p1] ? values[p1].name : match; // Return matched value or original if not found
    });

    // Replace dynamic #c# placeholders
    template = template.replace(/#c(\d+)#/g, (match: any, p1: string | number) => {
      return values[`c${p1}`] || match; // Return matched value or original if not found
    });

    // Replace dynamic #s# placeholders
    template = template.replace(/#s(\d+)#/g, (match: any, p1: string | number) => {
      return values[`s${p1}`] || match; // Return matched value or original if not found
    });

    return template;
  }

  cancel() {
    this.inputValues = { ...this.originalInputValues }; // Reset input values to original
    // console.log(this.inputValues);
    this.currentPage = PageType.Details; // Navigate to details page
    // this.showResults = false;
    // this.showDetails = true;
  }
  fid:number=0;
  // submitFeedback() {
  //   this.activatedRoute.queryParams.subscribe(params => {
  //     this.get_feedback_id = params['fid'] || "";
  //   });
  //   console.log(this.get_feedback_id);
  //   this.fid = +this.get_feedback_id;
  //   if (!this.feedback) {
  //     this.showAlert('Error', 'Please enter feedback before submitting.');
  //     return;
  //   }
  //   if (!this.fid) {
  //     this.showAlert('Error', 'Feedback ID is missing.');
  //     return;
  //   }

  //   this.apiService.PlanogramFinalFeedback(this.fid, this.feedback).subscribe(
  //     (response) => {
  //       this.showAlert('Success', 'Feedback submitted successfully.');
  //       this.feedback = ''; // Reset the textarea
  //     },
  //     (error) => {
  //       this.showAlert('Error', 'Failed to submit feedback.');
  //       console.error(error);
  //     }
  //   );
  // }

  // async showAlert(header: string, message: string) {
  //   const alert = await this.alertCtrl.create({
  //     header,
  //     message,
  //     buttons: ['OK'],
  //   });
  //   await alert.present();
  // }

  // submitFeedback() {
  //   // Check the value in local storage
  //   const appSelector = localStorage.getItem('app_selection');
  //   // console.log(appSelector);

  //   // Conditional call based on app-selector value
  //   if (appSelector === '1') {
  //     // this.fetchUserData(); // Call fetchUserData if app-selector is 1

  //   } else {
  //     // hp user data
  //     // this.fetchhpUser();
  //     // console.log("inside this condition");
  //     if (this.selectedOutlet && this.selectedCategory) {
  //       this.useroutlet = this.selectedOutlet.id;
  //       this.categoryId = this.selectedCategory.id;
  //     }

  //   }

  //   if (!this.useroutlet && !this.categoryId) {
  //     // if (this.selectedAreas.length === 0) {

  //     this.showNotification('Submission Error', 'Please fill all data before submission');
  //     return;
  //   }

  //   // Validate inputs
  //   // if (!this.selectedDate) {
  //   //   this.showNotification('Validation Error', 'Please select a date.');
  //   //   return;
  //   // }

  //   if (!this.feedback || this.feedback.trim() === '') {
  //     this.showNotification('Validation Error', 'Please write your feedback.');
  //     return;
  //   }

  //   if (this.area_planograms.length === 0 || this.selectedAreas.length === 0) {
  //     // if (this.selectedAreas.length === 0) {

  //     this.showNotification('Submission Error', 'No planograms data available for submission.');
  //     return;
  //   }

  //   // Convert selectedDate to Date object
  //   // const dateObject = new Date(this.selectedDate);

  //   // Format the date to YYYY-MM-DD
  //   // const formattedDate = this.formatDate(dateObject);




  //   // Prepare the data to send
  //   // const feedbackData = {
  //   //   userId: this.userId, // Replace with actual user ID
  //   //   storeId: this.useroutlet, // Replace with actual store ID
  //   //   categoryId: this.categoryId, // Replace with actual category ID
  //   //   feedback: this.feedback,
  //   //   feedbackDate: formattedDate,
  //   //   planograms: this.area_planograms.map((planogram: { planogramId: any; content: any; }) => ({
  //   //     planogramId: planogram.planogramId,
  //   //     content: planogram.content,
  //   //   })),
  //   // };

  //   const currentDate = new Date();
  //   const formattedDate = currentDate.toISOString().split('T')[0]; // 'YYYY-MM-DD'

  //   const feedbackData = {
  //     userId: this.userId, // Replace with actual user ID
  //     storeId: this.useroutlet, // Replace with actual store ID
  //     categoryId: this.categoryId, // Replace with actual category ID
  //     feedback: this.feedback,
  //     feedbackDate: formattedDate, // Capture current date in 'YYYY-MM-DD' format
  //     planograms: this.area_planograms.map((planogram: { planogramId: any; content: any; }) => ({
  //       planogramId: planogram.planogramId,
  //       content: planogram.content,
  //     })),
  //   };


  //   // console.log(feedbackData);

  //   // API call to submit feedback
  //   // this.apiService.submitPlanogramFeedback(feedbackData).subscribe(
  //   //   async (response) => {
  //   //     console.log('Feedback submitted successfully:', response);
  //   //     await this.showToast('Feedback submitted successfully!'); // Show success toast
  //   //     this.router.navigate(['/planogram-feedback']); // Redirect to planogram-feedback page

  //   //   },
  //   //   (error) => {
  //   //     console.error('Error submitting feedback:', error);
  //   //     this.showNotification('Error', 'Failed to submit feedback. Please try again.');
  //   //   }
  //   // );
  // }


  async submitFeedback() {
    // Get the feedback ID from query params
    this.activatedRoute.queryParams.subscribe(params => {
      this.get_feedback_id = params['fid'] || "";
    });

    this.fid = +this.get_feedback_id;

    if (!this.feedback) {
      this.showAlert('Info', 'Please enter feedback before submitting.');
      return;
    }
    if (!this.fid) {
      this.showAlert('Info', 'Slides Feedback is missing.');
      return;
    }

    // Show confirmation alert before API call
    const confirmAlert = await this.alertController.create({
      header: 'Confirm Submission',
      message: 'Are you sure you want to submit the final feedback?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Submission cancelled');
          }
        },
        {
          text: 'Submit',
          handler: () => {
            // Call the API if user confirms
            this.apiService.PlanogramFinalFeedback(this.fid, this.feedback).subscribe(
              async (response) => {
                const successAlert = await this.alertController.create({
                  header: 'Success',
                  message: 'Feedback submitted successfully.',
                  buttons: [
                    {
                      text: 'OK',
                      handler: () => {
                        this.router.navigate(['/home']); // Redirect to home page
                      }
                    }
                  ]
                });
                await successAlert.present();
                this.feedback = ''; // Reset the textarea
              },
              async (error) => {
                await this.showAlert('Error', 'Failed to submit feedback.');
                console.error(error);
              }
            );
          }
        }
      ]
    });

    await confirmAlert.present();
  }

  async showToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000, // Duration in milliseconds
      position: 'top', // Position of the toast
      color: 'success', // You can customize the color
    });

    await toast.present();
  }

  // Utility function to format date
  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  async showNotification(title: string, message: string) {
    const alert = await this.alertController.create({
      header: title, // Notification title
      message: message, // Notification message
      buttons: ['OK'], // OK button to dismiss the alert
    });

    await alert.present();
  }

  dummycheck(){
    this.router.navigate(['/planogram-area']);
  }

}