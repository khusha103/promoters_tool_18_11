import { Component, OnInit } from '@angular/core';
import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-servive-related',
  templateUrl: './service-related.page.html',
  styleUrls: ['./service-related.page.scss'],
})
export class ServiceRelatedPage implements OnInit {
  isLoading: boolean = true;
  items: Array<string> = [];
  activeCategoryId: number | null = 1; // Track the active category

  serviceRelatedPdfs: any[] = [];
  countryId: number = 2; // Example countryId
  lang: string = 'en'; // Example language
  documentPdfs: any[] = [];
  videoPdfs: any[] = [];
  selectedCategory!: number;

  constructor(private apiservice:ApiService,private iab: InAppBrowser) { }

  ngOnInit() {
    this.loadCategorywiseServiceRelatedData(1); // Load data for category 1 (Televisions) by default
  }

  // icons = [
  //   { imageUrl: '/assets/icon/Productspageicons/tc.svg', isActive: true },
  //   { imageUrl: '/assets/icon/Productspageicons/camera.svg', isActive: false },
  //   { imageUrl: '/assets/icon/Productspageicons/headphone.svg' , isActive: false},
  //   { imageUrl: '/assets/icon/Productspageicons/speaker.svg' , isActive: false}
  // ];

  // contents = [
  //   {
  //     // imageUrl: '/assets/icon/Sony-65-Inch-Smart-TV.png',
  //     imageUrl: '/assets/icon/Sony-65-Inch-Smart-TV.png',
  //     title: 'TELEVISIONS',
  //     buttons: ['FY24 Bravia main display serviceRelated', 'bravia new darwin remote demo serviceRelated']
  //   },
  //   {
  //     imageUrl: '/assets/icon/productspecification2.png',
  //     title: 'DIGITAL IMAGING',
  //     buttons: ['Interchangeable Lens', 'Compact Camera', 'Handycam']
  //   },
  //   {
  //     imageUrl: '/assets/icon/productspecification3.png',
  //     title: 'PERSONAL AUDIO',
  //     buttons: ['Headphones', 'In-ear', 'Wireless Speakers']
  //   },
  //   {
  //     imageUrl: '/assets/icon/productspecification4.png',
  //     title: 'HOME AUDIO',
  //     buttons: ['Sound bars', 'Home Theater', 'Home Audio System']
  //   },
  //   // Add more content objects for other icons
  // ];

  // selectedContent = this.contents[0];

  // selectIcon(index: number) {
  //   this.icons.forEach((icon, i) => {
  //     icon.isActive = i === index;
  //   });
  //   this.selectedContent = this.contents[index];
  // }


   // Define fixed titles and images for each category
   fixedCategories: { [key: number]: { title: string; imageUrl: string ;bannerImageUrl:string} } = {
    1: { title: 'TELEVISIONS', imageUrl: '/assets/icon/Productspageicons/tc.svg' ,bannerImageUrl: '/assets/icon/Sony-65-Inch-Smart-TV.png'},
    2: { title: 'DIGITAL IMAGING', imageUrl: '/assets/icon/Productspageicons/camera.svg',bannerImageUrl: '/assets/icon/productspecification2.png' },
    3: { title: 'PERSONAL AUDIO', imageUrl: '/assets/icon/Productspageicons/headphone.svg',bannerImageUrl: '/assets/icon/productspecification3.png' },
    4: { title: 'HOME AUDIO', imageUrl: '/assets/icon/Productspageicons/speaker.svg' ,bannerImageUrl: '/assets/icon/productspecification4.png'}
  };

   // Method to change category
 changeCategory(categoryId: number): void {
  // console.log(categoryId);
  this.activeCategoryId = categoryId; // Set the active category
  this.loadCategorywiseServiceRelatedData(categoryId); // Load data for the selected category
}


loadCategorywiseServiceRelatedData(categoryId: number): void {
  // console.log("cat id", categoryId);
  this.selectedCategory = categoryId;
  
  // Get category details from fixedCategories
  const categoryDetails = this.fixedCategories[categoryId];

  if (categoryDetails) {
    console.log("Category Title:", categoryDetails.title);
    console.log("Banner Image URL:", categoryDetails.bannerImageUrl);
  } else {
    console.error('Category not found');
  }

  this.apiservice.getServiceRelated(this.countryId, categoryId, this.lang).subscribe(
    response => {
      if (response.status) {
        console.log("serviceRelated", this.serviceRelatedPdfs);
        this.serviceRelatedPdfs = response.practices;
        this.separatePdfsByType(); // Call the method to filter PDFs
      } else {
        console.error('No data found');
        this.handleNoData() ;
      }
    },
    error => {
      console.error('Error fetching serviceRelated', error);
      this.handleError();
    }
  );
}

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

separatePdfsByType() {
  this.documentPdfs = this.serviceRelatedPdfs.filter(pdf => pdf.fileType === 'document');
  this.videoPdfs = this.serviceRelatedPdfs.filter(pdf => pdf.fileType === 'video');

  // Check if document PDFs are empty
  if (this.documentPdfs.length === 0) {
      console.warn('No document PDFs found');
      this.handleNoDocumentPdfs(); // Handle the absence of document PDFs
  }

  // Check if video PDFs are empty
  if (this.videoPdfs.length === 0) {
      console.warn('No video PDFs found');
      this.handleNoVideoPdfs(); // Handle the absence of video PDFs
  }
}

handleNoDocumentPdfs() {
  // Logic to handle absence of document PDFs
  // For example, you could set a default message or state
  this.documentPdfs = []; // Ensure it's an empty array
}

handleNoVideoPdfs() {
  // Logic to handle absence of video PDFs
  // For example, you could set a default message or state
  this.videoPdfs = []; // Ensure it's an empty array
}

openPdf(url: string) {
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
}