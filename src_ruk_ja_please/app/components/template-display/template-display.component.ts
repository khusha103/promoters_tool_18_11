import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-template-display',
  templateUrl: './template-display.component.html',
  styleUrls: ['./template-display.component.scss'],
  encapsulation: ViewEncapsulation.ShadowDom // Use Shadow DOM for encapsulation
})
export class TemplateDisplayComponent implements OnInit {
  @Input() title: string = 'Default Title'; // Default title
  @Input() content: string = '<p>No content available.</p>'; // Default content

  constructor() { }

  ngOnInit() { }
}