import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-promoter-ranking',
  templateUrl: './promoter-ranking.page.html',
  styleUrls: ['./promoter-ranking.page.scss'],
})
export class PromoterRankingPage implements OnInit {
  items = [
    { srNo: 1, name: 'John Doe', store: 'Store A', ranking: 5 },
    { srNo: 2, name: 'Jane Smith', store: 'Store B', ranking: 3 },
    { srNo: 3, name: 'Bob Johnson', store: 'Store C', ranking: 4 },
    { srNo: 4, name: 'Alice Williams', store: 'Store D', ranking: 2 },
    { srNo: 5, name: 'Chris Evans', store: 'Store E', ranking: 1 },
    { srNo: 6, name: 'Kate Brown', store: 'Store F', ranking: 6 },
    { srNo: 7, name: 'Tom Hardy', store: 'Store G', ranking: 7 },
    { srNo: 8, name: 'Tom Hardy', store: 'Store G', ranking: 7 },
    { srNo: 9, name: 'Tom Hardy', store: 'Store G', ranking: 7 },
    { srNo: 10, name: 'Tom Hardy', store: 'Store G', ranking: 7 },
    { srNo: 11, name: 'Tom Hardy', store: 'Store G', ranking: 7 },
    { srNo: 12, name: 'Tom Hardy', store: 'Store G', ranking: 7 },
    { srNo: 13, name: 'Tom Hardy', store: 'Store G', ranking: 7 },
    { srNo: 14, name: 'Tom Hardy', store: 'Store G', ranking: 7 },
    { srNo: 15, name: 'Tom Hardy', store: 'Store G', ranking: 7 },
    { srNo: 16, name: 'Tom Hardy', store: 'Store G', ranking: 7 },
    // Add more items as needed
  ];
  page = 1;

  constructor() { }

  ngOnInit() { }
}
