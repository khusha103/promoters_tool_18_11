import { Component, OnInit } from '@angular/core';
import { ActionSheetController, AlertController } from '@ionic/angular';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';


@Component({
  selector: 'app-daily-vmdchecklist-feedphoto',
  templateUrl: './daily-vmdchecklist-feedphoto.page.html',
  styleUrls: ['./daily-vmdchecklist-feedphoto.page.scss'],
})
export class DailyVmdchecklistFeedphotoPage implements OnInit {



photos: { url: string; caption?: string }[] = []; 
temporaryCaptions: string[] = []; 
feedback: string = ''; 
categoryId: string = ''; 
evalId: string = ''; 
pagesource: string = '';

constructor(
  private actionSheetController: ActionSheetController,
  private route: ActivatedRoute,
  private apiService: ApiService,
  private alertController: AlertController,
  private router: Router
) {}

ngOnInit() {
  this.route.queryParams.subscribe(params => {
    // Retrieve categoryId and evalId from query params
    this.categoryId = params['categoryId'];
    this.evalId = params['evalId'];
    this.pagesource = params['s'];

    console.log('Category ID:', this.categoryId);
    console.log('Evaluation ID:', this.evalId);
  });
}

async selectImage() {
  const actionSheet = await this.actionSheetController.create({
    header: 'Select Image Source',
    buttons: [
      {
        text: 'Camera',
        handler: () => {
          this.captureImage(CameraSource.Camera);
        }
      },
      {
        text: 'Gallery',
        handler: () => {
          this.captureImage(CameraSource.Photos);
        }
      },
      {
        text: 'Cancel',
        role: 'cancel'
      }
    ]
  });
  await actionSheet.present();
}

// Function to capture image from Camera or Gallery
async captureImage(source: CameraSource) {
  try {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.Uri,
      source: source
    });

    if (image && image.webPath) {
      const fileUri = image.webPath; 
      this.photos.push({ url: fileUri, caption: '' }); 
      this.temporaryCaptions.push(''); 
    }
  } catch (error) {
    console.error('Error capturing image:', error);
  }
}

// Function to submit feedback along with images and captions
submitFeedback() {
  // Create FormData object to prepare data for submission
  const formData = new FormData();

  formData.append('feedback', this.feedback);
  formData.append('category_id', this.categoryId);
  formData.append('evalid', this.evalId);

  // Append images and captions
  this.photos.forEach((photo, index) => {
    // Convert the image URI to a file using a blob (since we need to upload binary data)
    fetch(photo.url)
      .then(res => res.blob())
      .then(blob => {
        formData.append('images[]', blob, `image_${index}.jpg`); // Append image as binary data
        formData.append('captions[]', this.temporaryCaptions[index] || ''); // Append caption
        
        // After adding the image and caption, you can send the FormData
        if (index === this.photos.length - 1) {
          // Log FormData content
          this.logFormData(formData);

          //submit formData
          this.sendFeedback(formData); // Send the data when the last image is processed
        }
      })
      .catch(err => console.error('Error converting image to blob:', err));
  });
}



// Function to submit feedback along with images and captions
submitPromoterFeedback() {
  // Create FormData object to prepare data for submission
  const formData = new FormData();

  formData.append('feedback', this.feedback);
  formData.append('category_id', this.categoryId);
  formData.append('evalid', this.evalId);

  // Append images and captions
  this.photos.forEach((photo, index) => {
    // Convert the image URI to a file using a blob (since we need to upload binary data)
    fetch(photo.url)
      .then(res => res.blob())
      .then(blob => {
        formData.append('images[]', blob, `image_${index}.jpg`); // Append image as binary data
        formData.append('captions[]', this.temporaryCaptions[index] || ''); // Append caption
        
        // After adding the image and caption, you can send the FormData
        if (index === this.photos.length - 1) {
          // Log FormData content
          this.logFormData(formData);

          //submit formData
          this.sendPromoterFeedback(formData); // Send the data when the last image is processed
        }
      })
      .catch(err => console.error('Error converting image to blob:', err));
  });
}


async sendPromoterFeedback(formData: FormData) {
  console.log("submit formData", formData);
  this.apiService.submitPromoterFeedback(formData).subscribe(
    async (response) => {
      console.log('Feedback submitted successfully:', response);
      
      // Show alert after successful submission
      const alert = await this.alertController.create({
        header: 'Success',
        message: 'Promoter Checklist Evalution done successfully want to do more evaluations',
        buttons: [
          {
            text: 'Yes',
            handler: () => {
              // Redirect to page 1
              // Replace with your actual routing logic
              this.router.navigate(['/promoters-assessment']);
            }
          },
          {
            text: 'No',
            handler: () => {
              // Redirect to page 2
              // Replace with your actual routing logic
              this.router.navigate(['/home']);
            }
          }
        ]
      });
      await alert.present();

      // Reset after successful submission
      this.feedback = '';
      this.photos = [];
      this.temporaryCaptions = [];
    },
    (error) => {
      console.error('Error submitting feedback:', error);
    }
  );
}

async sendFeedback(formData: FormData) {
  console.log("submit formData", formData);
  this.apiService.submitVmdFeedback(formData).subscribe(
    async (response) => {
      console.log('Feedback submitted successfully:', response);
      
      // Show alert after successful submission
      const alert = await this.alertController.create({
        header: 'Success',
        message: 'Checklist Evalution done successfully want to do more evaluations',
        buttons: [
          {
            text: 'Yes',
            handler: () => {
              // Redirect to page 1
              this.router.navigate(['/daily-vmd-checklist']);
            }
          },
          {
            text: 'No',
            handler: () => {
              // Redirect to page 2
              this.router.navigate(['/home']);
            }
          }
        ]
      });
      await alert.present();

      // Reset after successful submission
      this.feedback = '';
      this.photos = [];
      this.temporaryCaptions = [];
    },
    (error) => {
      console.error('Error submitting feedback:', error);
    }
  );
}

// Function to log FormData before sending it to the API
logFormData(formData: FormData) {
  formData.forEach((value, key) => {
    // Log the key and value to the console
    console.log(`${key}:`, value);
  });
}

removeImage(index: number) {
  this.photos.splice(index, 1); // Remove the photo from the array
  this.temporaryCaptions.splice(index, 1); // Remove the corresponding caption
}

isSubmitEnabled(): boolean {
  const allCaptionsFilled = this.temporaryCaptions.every(caption => caption.trim() !== '');
  // return allCaptionsFilled && this.feedback.trim() !== '' && this.photos.length > 0;
  return allCaptionsFilled && this.photos.length > 0;
}
}