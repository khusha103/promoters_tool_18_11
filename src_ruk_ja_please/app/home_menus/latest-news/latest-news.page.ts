import { Component, OnInit } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';


@Component({
  selector: 'latest-news',
  templateUrl: './latest-news.page.html',
  styleUrls: ['./latest-news.page.scss'],
})
export class LatestNewsPage implements OnInit {

  icons = [
    { imageUrl: '/assets/icon/Productspageicons/tc.svg', isActive: true },
    { imageUrl: '/assets/icon/Productspageicons/camera.svg', isActive: false },
    { imageUrl: '/assets/icon/Productspageicons/headphone.svg' , isActive: false},
    { imageUrl: '/assets/icon/Productspageicons/speaker.svg' , isActive: false}
  ];

  contents = [
    {
      imageUrl: '/assets/icon/televisions.png',
      title: 'TELEVISIONS',
      years: [
        {
          year: '2023',
          items: ['X77L', 'X80L', 'X85L', 'X85L']
        },
        {
          year: '2024',
          items: ['X77L', 'X80L', 'X85L']
        }
      ]
            // buttons: ['X77L', 'X80L', 'X85L','X77L', 'X80L', 'X85L']

    },
    {
      imageUrl: '/assets/icon/digital_imaging.png',
      title: 'DIGITAL IMAGING',
      years: [
        {
          year: '2023',
          items: ['Alpha 9III', 'Alpha 7CR', 'SEL300F28GM', 'ECM-S1']
        },
        {
          year: '2024',
          items: ['ALPHA 7CII', 'ZV-1M2', 'A6700', 'ZV-E1', 'ALPHA 7RV']
        }
      ]
      // buttons: ['Alpha 9III', 'Alpha 7CR', 'SEL300F28GM', 'ECM-S1', 'ALPHA 7CII', 'ZV-1M2', 'A6700', 'ZV-E1', 'ALPHA 7RV']
    },
    {
      imageUrl: '/assets/icon/personal_audio.png',
      title: 'PERSONAL AUDIO',
      years: [
        {
          year: '2023',
          items: ['xlls1', 'xlls2', 'xlls2','xlls4', 'xlls5', 'xlls6']
        },
        {
          year: '2024',
          items: ['xlls1', 'xlls2', 'xlls2','xlls4', 'xlls5', 'xlls6']
        }
      ]
      // buttons: ['xlls1', 'xlls2', 'xlls2','xlls4', 'xlls5', 'xlls6','xlls1', 'xlls2', 'xlls2','xlls4', 'xlls5', 'xlls6']
    },
    {
      imageUrl: '/assets/icon/home_audio.png',
      title: 'HOME AUDIO',
      years: [
        {
          year: '2023',
          items: ['x77h1', 'x77h2', 'x77h3', 'x77h4', 'x77h5', 'x77h7']
        },
        {
          year: '2024',
          items: ['x77h1', 'x77h2', 'x77h3', 'x77h4', 'x77h5', 'x77h7']
        }
      ]
      // buttons: ['x77h1', 'x77h2', 'x77h3', 'x77h4', 'x77h5', 'x77h7','x77h1', 'x77h2', 'x77h3', 'x77h4', 'x77h5', 'x77h7']
    }
  ];

  selectedContent: any;
  selectedProduct: any = null;
  getProductImage(productName: string): string {
    // Replace this with your logic to get the correct image path for each product
    return `/assets/icon/salesproduct/${productName.toLowerCase().replace(' ', '_')}.png`;
  }
  constructor(private router: Router) { }

  ngOnInit() {
    this.selectedContent = this.contents[0];
  }

  selectIcon(index: number) {
    this.icons.forEach((icon, i) => {
      icon.isActive = i === index;
    });
    this.selectedContent = this.contents[index];
    this.selectedProduct = null;
  }
  // selectProduct(product: any) {
  //   let navigationExtras: NavigationExtras = {
  //     state: {
  //       product: product,
  //       productImage: this.getProductImage(product)
  //     }
  //   };
  //   this.router.navigate(['/product-inner'], navigationExtras);
  // }




  // selectProduct(product: string) {
  //   let navigationExtras: NavigationExtras = {
  //     state: {
  //       product: product,
  //       productImage: this.getProductImage(product),
  //       productName: product // Pass the product name
  //     }
  //   };
  //   this.router.navigate(['/product-inner'], navigationExtras);
  // }



  selectProduct(item: string, year: string) {
    let navigationExtras: NavigationExtras = {
      state: {
        product: item,
        productImage: this.getProductImage(item),
        year: year
      }
    };
    this.router.navigate(['/product-inner'], navigationExtras);
  }
}