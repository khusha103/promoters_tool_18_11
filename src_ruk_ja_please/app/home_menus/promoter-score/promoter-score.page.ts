import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-promoter-score',
  templateUrl: './promoter-score.page.html',
  styleUrls: ['./promoter-score.page.scss'],
})
export class PromoterScorePage implements OnInit {

  items = [
    { rank: 1, name: 'John Doe', store: 'Store A', score: 5 },
    { rank: 2, name: 'Jane Smith', store: 'Store B', score: 3 },
    { rank: 3, name: 'Bob Johnson', store: 'Store C', score: 4 },
    { rank: 4, name: 'Alice Williams', store: 'Store D', score: 2 },
    { rank: 5, name: 'Chris Evans', store: 'Store E', score: 1 },
    { rank: 6, name: 'Kate Brown', store: 'Store F', score: 6 },
    { rank: 7, name: 'Tom Hardy', store: 'Store G', score: 7 },
    { rank: 8, name: 'Tom Hardy', store: 'Store G', score: 7 },
    { rank: 9, name: 'Tom Hardy', store: 'Store G', score: 7 },
    { rank: 10, name: 'Tom Hardy', store: 'Store G', score: 7 },
    { rank: 11, name: 'Tom Hardy', store: 'Store G', score: 7 },
    { rank: 12, name: 'Tom Hardy', store: 'Store G', score: 7 },
    { rank: 13, name: 'Tom Hardy', store: 'Store G', score: 7 },
    { rank: 14, name: 'Tom Hardy', store: 'Store G', score: 7 },
    { rank: 15, name: 'Tom Hardy', store: 'Store G', score: 7 },
    { rank: 16, name: 'Tom Hardy', store: 'Store G', score: 7 },
    // Add more items as needed
  ];
  page = 1;

  constructor() { }

  ngOnInit() {
  }

}
