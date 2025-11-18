import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-popover-content',
  templateUrl: './popover-content.component.html',
  styleUrls: ['./popover-content.component.scss'],
})
export class PopoverContentComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}

  @Input() tooltipText: string = ''; // This will hold the text to display in the popover

}
