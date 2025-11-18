import { Component, OnInit, ViewChild } from '@angular/core';
import { AlertController, IonPopover, ToastController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-upload-competitor-sales',
  templateUrl: './upload-competitor-sales.page.html',
  styleUrls: ['./upload-competitor-sales.page.scss'],
})
export class UploadCompetitorSalesPage implements OnInit {

  @ViewChild('fromPopover') fromPopover?: IonPopover;

  isFromPopoverOpen: boolean = false;
  selectedFromDate: string | null = null;
  categories: any[] = [];
  products: any[] = [];
  alloutlets: any[] = [];
  allretailers: any[] = [];
  userIdfromlocal: any;
  // selectedBrands: string[] = []; // Initialize as an empty array
  selectedBrands: any;



  categoryOptions = {
    header: 'Select Category'
  }
  brandsOptions = {
    header: 'Select Brand'
  };

  brands: { brand: string }[] = []; // Declare brands as an array of objects with a brand property

  selectedCategory: any;
  selectedProduct: any;
  useroutlet: any;


  onFromDateChange(event: any) {
    // Get the full date from the event
    const fullDate = new Date(event.detail.value);
    const year = fullDate.getFullYear();
    const month = String(fullDate.getMonth() + 1).padStart(2, '0');
    const day = String(fullDate.getDate()).padStart(2, '0');
    this.selectedFromDate = `${year}-${month}-${day}`;
    this.fromPopover?.dismiss();
  }

  tableRows: any[] = [];

  constructor(private authservice:AuthService, private alertController: AlertController, private apiService: ApiService, private userService: UserService, private toastController: ToastController) { }

  ngOnInit() {
    this.getUserRole();
  }

  
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
            this.cid=response.data.region_id;
            this.lang =response.data.user_lang;
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

  intializeapp(){
    this.initializeRows();
    this.fetchAllCategories();
    this.loadBrands();
    this.fetchAllRetailers();
    this.fetchAllOutlets();
  }

  fetchUserData() {
    const userIdString = localStorage.getItem('userId');
    const userId = userIdString ? Number(userIdString) : null;
    this.userIdfromlocal = userId;
    // const roleId = localStorage.getItem('roleId');
    const roleId = this.roleId;


    if (userId !== null) {
      // Check if roleId is '1' (superadmin)
      if (roleId === '1') {
        console.log('Superadmin detected');
      } else {
        this.userService.fetchUserData(userId).subscribe(
          (response) => {
            // Check if response is valid and has a message property
            if (response && response.status) {
              this.setUserData(response.data);
              // console.log(response.data);
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
    const retailerId = this.allretailers.find(r => r.name === userData.retailer_name); // Get retailer ID

    if (retailerId.id) {
      // Filter outlets based on the retailer ID
      const outlet = this.alloutlets.find(o => o.report_name === userData.store_name && o.retailer_id === retailerId.id);
      if (outlet) {
        this.useroutlet = Number(outlet.id);
      } else {
        // No matching outlet found
        console.log('No matching outlet found for the given store name and retailer ID');
      }
    } else {
      // No matching retailer found
      console.log('No matching retailer found for the given retailer name');
    }
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

  //use in case of promoters only
  fetchAllOutlets() {
    this.apiService.getAllOutlets().subscribe(
      (response) => {
        this.alloutlets = response.data;
        // console.log(this.alloutlets);
        this.fetchUserData();
      },
      (error) => {
        console.error('Error fetching outlets:', error);
      }
    );
  }

  // onProductSelected(productId: string) {
  //   console.log('Selected Product ID:', productId);
  //   this.selectedProduct = productId;
  // }
  selectedProducts: { [key: number]: any } = {}; // To track selected products by row ID
  onProductSelected(event: { productId: any, rowId: number }) {
    const { productId, rowId } = event;

    const selectedProduct = this.products.find(product => product.id === productId.id);

    if (selectedProduct) {
      // Store the selected product's name by row ID
      this.selectedProducts[rowId] = selectedProduct.name; // Store the name

      // Log the selected product and row ID
      console.log('Selected Product ID:', selectedProduct.id);
      console.log('Selected Product Name:', selectedProduct.name);
      console.log('Row ID:', rowId);

      // Optionally, log the entire selected products object for debugging
      console.log('All Selected Products:', this.selectedProducts);
    }
  }

  initializeRows() {
    this.tableRows = [
      { serialNumber: 1, selectedProduct: null },
      { serialNumber: 2, selectedProduct: null },
      { serialNumber: 3, selectedProduct: null },
      { serialNumber: 4, selectedProduct: null }
    ];
  }
  addRow() {
    const newSerialNumber = this.tableRows.length + 1;
    this.tableRows.push({ serialNumber: newSerialNumber });
  }

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

  async onCategoryChange(categoryId: number) {
    if (categoryId) {
      const brand = this.selectedBrands;
      if (brand) {
        this.fetchBrandProductsByCategorynBrands(brand, categoryId);
      }
    } else {
      // Reset all dependent dropdowns if no category is selected
      // this.usercategory = null;
    }
  }

  loadBrands() {
    this.apiService.getBrands().subscribe(
      (data) => {
        this.brands = data;
        // console.log(this.brands);
      },
      (error) => {
        console.error('Error fetching brands:', error);
      }
    );
  }

  onBrandChange(event: any) {
    this.selectedBrands = event.detail.value;
    console.log('Selected Brand:', this.selectedBrands);

    const brand = this.selectedBrands;

    // const brandString = brand.join(','); 
    // console.log(brandString); 

    const category = this.selectedCategory?.id;

    if (category && brand) {
    
        this.fetchBrandProductsByCategorynBrands(brand, category);
    }
  }

  // Independent alert method
  async showIndependentAlert(message: string, header: string = 'Notification') {
    const alert = await this.alertController.create({
      header: header,
      message: message,
      buttons: ['OK']
    });

    await alert.present();
  }

  fetchBrandProductsByCategorynBrands(brand: string, categoryId: number) {
    this.apiService.getProductsByCategorynBrands(brand, categoryId).subscribe(
      (response) => {
        if (response.status) {
          // Check if response.data has products
          if (response.data.length > 0) {
            // Transform the products to the desired format
            this.products = response.data.map((productName: any, index: number) => ({
              id: (index + 1).toString(), // Assigning an incremental ID
              code: null,
              name: productName,
              segment: null,
              category_id: categoryId.toString(), // Assuming you want to keep the category ID
              active: null,
              created_on: null,
              updated_on: null
            }));

            // console.log(this.products);
          } else {
            this.products = [];
            this.selectedProduct = null; // Resetting the selected product
            // Show alert message that no products were found
            this.showIndependentAlert('No products found for the selected brands and category.');
          }
        } else {
          console.error('Failed to fetch products:', response.message);
          this.showIndependentAlert('Failed to fetch products: ' + response.message);
        }
      },
      (error) => {
        console.error('Error fetching products:', error);
        this.products = [];
        this.showIndependentAlert('An error occurred while fetching products.');
      }
    );
  }

  submitcompSales() {
    // Validate inputs
    if (!this.selectedFromDate) {
      this.showAlert('Please select a date.');
      return;
    }
    if (!this.selectedBrands) {
      this.showAlert('Please select a brand.');
      return;
    }
    if (!this.selectedCategory) {
      this.showAlert('Please select a category.');
      return;
    }

    const hasInvalidRows = this.tableRows.some(row => {
      return !this.selectedProducts[row.serialNumber] || row.quantity <= 0 || row.price <= 0;
    });

    if (hasInvalidRows) {
      this.showAlert('Please ensure all rows have a selected model, quantity, and price greater than zero.');
      return;
    }

    // Prepare the payload
    const payload = {
      userId: this.userIdfromlocal || null,
      storeId: this.useroutlet || null,
      categoryId: this.selectedCategory.id,
      saleDate: this.selectedFromDate,
      models: this.tableRows.map(row => ({
        // model: row.selectedProduct,
        model: this.selectedProducts[row.serialNumber],
        quantity: row.quantity || 0,
        price: row.price || 0,
        brand: this.selectedBrands
      })).filter(model => model)
    };

    console.log(payload);

    // Confirm alert before final submission
    this.confirmSubmission().then(confirmed => {
        if (confirmed) {
            // Send POST request to API
            this.apiService.submitcompSalesData(payload).subscribe(
                response => {
                    if (response.status) {
                        this.showSuccessToast('Data submitted successfully!');
                        this.resetFields(); // Reset form after successful submission
                    } else {
                        this.showAlert(`Error: ${response.message}`);
                    }
                },
                error => {
                    console.error('Error submitting data:', error);
                    this.showAlert('An error occurred while submitting data.');
                }
            );
        }
    });
  }

  async showAlert(message: string, header: string = 'Validation Error') {
    const alert = await this.alertController.create({
      header: header,
      message: message,
      buttons: ['OK']
    });

    await alert.present();
  }

  // New method for confirmation alert
  async confirmSubmission() {
    const alert = await this.alertController.create({
      header: 'Confirm Submission',
      message: 'Are you sure you want to submit the data?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary'
        },
        {
          text: 'Confirm',
          handler: () => {
            return true;
          }
        }
      ]
    });

    await alert.present();

    const { role } = await alert.onDidDismiss();
    return role !== 'cancel';
  }

  // Method to reset all fields after successful submission
  resetFields() {
    this.selectedFromDate = null;
    this.selectedBrands = null;
    this.selectedCategory = null;
    this.products = [];
    this.initializeRows();
  }

  // New method to show success toast message
  async showSuccessToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      position: 'bottom',
      color: 'success'
    });

    await toast.present();
  }
}