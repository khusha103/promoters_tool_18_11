import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';
import { environment } from 'src/environments/environment';

interface SalesTalkItem {
  id: number;
  title: string;
  body: string;
  url: string;
  fileType: string;
  isNew: boolean; // Indicates if the document is new or has been opened
}


// Define an interface for a single tracking entry
interface TrackingEntry {
  id: string;
  user_id: string;
  country_id: string;
  module_id: string;
  module_doc_id: string;
  new_check_status: string;
  created_on: string;
  updated_on: string;
}

// Define an interface for the entire tracking response
interface TrackingResponse {
  status: boolean;
  data: TrackingEntry[];
}

@Component({
  selector: 'app-product-inner',
  templateUrl: './product-inner.page.html',
  styleUrls: ['./product-inner.page.scss'],
})
export class ProductInnerPage implements OnInit {
  product?: string;
  productImage?: string;
  productName?: string;
  seriesId?: string;
  categoryId?: string;
  sourcepage?: string;

  trainingPdfs!: SalesTalkItem[];
  documentPdfs!: SalesTalkItem[];
  videoPdfs!: SalesTalkItem[];

  constructor(private router: Router,private authservice:AuthService, private route: ActivatedRoute, private apiService: ApiService, private iab: InAppBrowser, private cd: ChangeDetectorRef) { }

  ngOnInit() {
   
    this.getUserRole();
  }

  roleId: string | null = null;
  // lang: string | null = null;
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
            
            //when get roleid then call methods
           this.initializeApp();
           
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

  initializeApp(){
    this.route.paramMap.subscribe(params => {
      this.productName = params.get('productName') || undefined;
      // this.productImage = `https://ekarigartech.com/erp/series_img/${params.get('productImage')}` || undefined;
      this.productImage = `${environment.apiBaseUrl}/series_img/${params.get('productImage')}` || undefined;

      this.seriesId = params.get('seriesId') || undefined;
      this.categoryId = params.get('categoryId') || undefined;
      this.sourcepage = params.get('sourcepage') || undefined;
    });

    // Load results based on source page
    if (this.sourcepage === "countertalk") {
      this.loadCounterTalkResults();
    } else if (this.sourcepage === "salestalk") {
      this.loadSalesTalkResults();
    } else {
      console.log("source page is not defined");
    }
  }

  countryid: string = "";

  loadCounterTalkResults() {
    // Check if seriesId is defined
    if (this.seriesId) {
      const seriesId = Number(this.seriesId); // Convert seriesId to a number
      const category_id = Number(this.categoryId); // Convert categoryId to a number
      const heading = 1; // Fixed as countertalk page
  
      // Retrieve country ID from local storage and convert it to a number
      // const storedCountryId = localStorage.getItem('cid');
      const storedCountryId = this.cid;

      const country = storedCountryId ? Number(storedCountryId) : 0; // Default to 0 if not found or invalid
  
      // Retrieve language from local storage, defaulting to 'en' if not found
      const language = localStorage.getItem('lang') || 'en';
  
      // Call the API service with the retrieved values
      this.apiService.getCounterTalkResults(country, category_id, heading, seriesId, language).subscribe(
        response => {
          if (response.status) {
            this.trainingPdfs = response.training_pdfs; // Store training PDFs from response
            this.checkDocumentStatus(); // Check which documents are new
            this.separatePdfsByType(); // Separate PDFs by type
          } else {
            console.error('No data found:', response.message); // Log message if no data found
          }
        },
        error => {
          console.error('Error fetching counter talk results:', error); // Log error if API call fails
        }
      );
    } else {
      console.error('Series ID is undefined. Cannot load counter talk results.'); // Log if seriesId is not defined
    }
  }

  loadSalesTalkResults() {
    // Check if seriesId is defined
    if (this.seriesId) {
      const seriesId = Number(this.seriesId); // Convert seriesId to a number
      const category_id = Number(this.categoryId); // Convert categoryId to a number
      const heading = 2; // Fixed as sales talk page
  
      // Retrieve country ID and language from local storage
      // const storedCountryId = localStorage.getItem('cid');
      const storedCountryId = this.cid;

      const country = storedCountryId ? Number(storedCountryId) : 0; // Default to NaN if not found
      const language = localStorage.getItem('lang') || 'en'; // Default to 'en' if not found
  
      // Check if country is a valid number
      if (!isNaN(country)) {
        // Call the API service with the retrieved values
        this.apiService.getSalesTalkResults(country, category_id, heading, seriesId, language).subscribe(
          response => {
            if (response.status) {
              this.trainingPdfs = response.training_pdfs; // Store training PDFs from response
              this.checkDocumentStatus(); // Check which documents are new
              this.separatePdfsByType(); // Separate PDFs by type
            } else {
              console.error('No data found:', response.message); // Log message if no data found
            }
          },
          error => {
            console.error('Error fetching sales talk results:', error); // Log error if API call fails
          }
        );
      } else {
        console.error('Country ID is undefined or invalid. Cannot load sales talk results.'); // Log if country ID is invalid
      }
    } else {
      console.error('Series ID is undefined. Cannot load sales talk results.'); // Log if seriesId is not defined
    }
  }

  checkDocumentStatus() {
    const userId = Number(localStorage.getItem('userId')); // Get user ID from local storage

    // Fetch tracking data for the user
    this.apiService.getTrackingData(userId).subscribe(trackingResponse => {
      // console.log('Tracking Response:', trackingResponse); // Log the full response

      // Check if response has status and data
      if (trackingResponse.status && Array.isArray(trackingResponse.data)) {
        // console.log('Tracked Documents:', trackingResponse.data); // Log the data array

        // Extract tracked document IDs
        const trackedDocumentIds = trackingResponse.data.map(entry => entry.module_doc_id); // Extract module_doc_id from each entry

        // console.log('Tracked Document IDs:', trackedDocumentIds); // Log tracked document IDs

        // Create an array of documents that need to be updated
        const documentsToUpdate = this.trainingPdfs.filter(doc => trackedDocumentIds.includes(doc.id.toString()));

        // Update each document's isNew property based on matching tracked IDs
        documentsToUpdate.forEach(doc => {
          doc.isNew = false; // Set isNew to false if it's in tracked IDs (not new)
        });

        this.cd.detectChanges(); // Notify Angular to check for changes
      } else {
        console.error('Unexpected response structure:', trackingResponse);
      }

    }, error => {
      console.error('Error fetching tracking data:', error);
    });
  }

  separatePdfsByType() {
    this.documentPdfs = this.trainingPdfs.filter(pdf => pdf.fileType === 'document');
    this.videoPdfs = this.trainingPdfs.filter(pdf => pdf.fileType === 'video');
  }

  openVideo(video: any) {
    const browser = this.iab.create(
      video.url,
      '_blank',
      {
        hidden: 'no',
        hardwareback: 'yes',
        fullscreen: 'no'
      }
    );

    const userId = Number(localStorage.getItem('userId'));
    // const countryId = Number(localStorage.getItem('cid'));
    const countryId = Number(this.cid);


    let moduleId;
    if (video.module === "salestalk") {
      moduleId = 1;
    } else if (video.module === "countertalk") {
      moduleId = 2;
    } else if (video.module === "guidelines") {
      moduleId = 3;
    } else {
      console.error("Unknown module type:", video.module);
    }

    const trackingData = {
      user_id: userId,
      module_id: moduleId,
      module_doc_id: video.id,
      country_id: countryId,
      isNew: video.isNew
    };

    console.log("track", trackingData);

    // Track document open
    this.apiService.trackDocumentOpen(trackingData)
      .subscribe(response => {
        console.log('Tracking response:', response);
        // Handle success or failure as needed
      }, error => {
        console.error('Error tracking document open:', error);
        // Handle error as needed
      });

    // Listen for browser close event
    browser.on('exit').subscribe(() => {
      console.log('InAppBrowser closed');
      this.checkDocumentStatus(); // Call your method to refresh or update status
    });
  }

  openPdf(pdf: any) {
    const browser = this.iab.create(
      pdf.url,
      '_system',
      {
        hidden: 'no',
        hardwareback: 'yes',
        fullscreen: 'no'
      }
    );

    const userId = Number(localStorage.getItem('userId'));
    // const countryId = Number(localStorage.getItem('cid'));
    const countryId = Number(this.cid);


    let moduleId;
    if (pdf.module === "salestalk") {
      moduleId = 1;
    } else if (pdf.module === "countertalk") {
      moduleId = 2;
    } else if (pdf.module === "guidelines") {
      moduleId = 3;
    } else {
      console.error("Unknown module type:", pdf.module);
    }

    const trackingData = {
      user_id: userId,
      module_id: moduleId,
      module_doc_id: pdf.id,
      country_id: countryId,
      isNew: pdf.isNew
    };

    // Track document open
    this.apiService.trackDocumentOpen(trackingData)
      .subscribe(response => {
        console.log('Tracking response:', response);
        // Handle success or failure as needed
      }, error => {
        console.error('Error tracking document open:', error);
        // Handle error as needed
      });

    // Listen for browser close event
    browser.on('exit').subscribe(() => {
      console.log('InAppBrowser closed');
      this.checkDocumentStatus(); // Call your method to refresh or update status
    });
  }
}