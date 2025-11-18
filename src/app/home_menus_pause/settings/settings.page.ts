import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {
  usertype: any;
  selectedLanguage: string = ''; // Variable to hold the selected language

  // Language mapping
  private languageMap: { [key: string]: string } = {
    en: 'English',
    ar: 'Arabic',
    fr: 'French',
    ru: 'Russian',
  };

  constructor(private router: Router, private alertController: AlertController,private languageService:ApiService) {}

  ngOnInit() {
    this.usertype = localStorage.getItem('app_selection'); // Get user type from local storage
    this.loadLanguage(); // Load the language when the component initializes
    console.log(this.usertype);
  }

  ionViewWillEnter() {
    this.usertype = localStorage.getItem('app_selection'); // Refresh user type when entering view
    console.log(this.usertype);
  }

  loadLanguage() {
    const lang = localStorage.getItem('lang'); // Get the language from local storage
    if (lang) {
      this.selectedLanguage = lang; // Set the selected language
    }
  }

  navigateToChangePassword() {
    this.router.navigate(['/change-password']); // Navigate to change password page
  }

  setLanguage(event: any) {
    const selectedLanguage = event.detail.value; // Get selected language
    localStorage.setItem('lang', selectedLanguage); // Set language in local storage

    const languageIdMap:any = {
      en: 1,
      ar: 2,
      fr: 3,
      ru: 4,
    };

    const languageId = languageIdMap[selectedLanguage];
    const userId = Number(localStorage.getItem('userId'));

    // Save language to database via API
    this.languageService.saveLanguage(languageId,userId).subscribe(
      response => {
        console.log('Language saved successfully:', response);
        this.showAlert(selectedLanguage); // Show alert after saving
      },
      error => {
        console.error('Error saving language:', error);
      }
    );
  }

  // async showAlert(languageCode: string) {
  //   const fullLanguageName = this.languageMap[languageCode] || languageCode; // Get full language name

  //   const alert = await this.alertController.create({
  //     header: 'Language Changed',
  //     message: `You have successfully changed the language to ${fullLanguageName}.`,
  //     buttons: [
  //       {
  //         text: 'OK',
  //         handler: () => {
  //           this.router.navigate(['/home']); // Redirect to home page using Router
  //         },
  //       },
  //     ],
  //   });

  //   await alert.present();
  // }

  async showAlert(languageCode: string) {
    const languageMessages: { [key: string]: { header: string; message: string } } = {
      en: { 
        header: 'Language Changed', 
        message: 'You have successfully changed the language to English. Please note, the interface language will remain English, but content will be in English.' 
      },
      ar: { 
        header: 'تم تغيير اللغة', 
        message: 'لقد قمت بتغيير اللغة بنجاح إلى العربية. يرجى ملاحظة أن لغة الواجهة ستظل بالإنجليزية، ولكن المحتوى سيكون باللغة العربية.' 
      },
      fr: { 
        header: 'Langue changée', 
        message: 'Vous avez changé la langue avec succès en français. Veuillez noter que la langue de l\'interface restera en anglais, mais le contenu sera en français.' 
      },
      ru: { 
        header: 'Язык изменен', 
        message: 'Вы успешно изменили язык на русский. Обратите внимание, что язык интерфейса останется английским, но контент будет на русском.' 
      },
    };
  
    const alertMessage = languageMessages[languageCode] || languageMessages['en']; // Default to English if not found
  
    const alert = await this.alertController.create({
      header: alertMessage.header,
      message: alertMessage.message,
      buttons: [
        {
          text: 'OK',
          handler: () => {
            this.router.navigate(['/home']); // Redirect to home page using Router
          },
        },
      ],
    });
  
    await alert.present();
  }
  
}
