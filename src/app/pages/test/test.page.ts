import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-test',
  templateUrl: './test.page.html',
  styleUrls: ['./test.page.scss'],
})
export class TestPage implements OnInit {
  
  

  ngOnInit() {

  }
  images = [
    "https://ekarigartech.com/happy/uploads/Areas/eae63a4f6f59ba119abc2a9c80dc3a83.jpeg",
    "https://example.com/another-image.jpg",
    "https://example.com/more-image.jpg"
  ];

  dropdownItems = [
    { options: ['RMF-TX800P', 'Option 2', 'Option 3'] },
    { options: ['BRAVIA CAM FY22', 'Option 2', 'Option 3'] }
  ];

  selectedItems: string[] = [];
  feedbacks: string[] = [];

  addInputField() {
    this.dropdownItems.push({ options: ['New Option 1', 'New Option 2'] });
    this.selectedItems.push('');
    this.feedbacks.push('');
  }
}