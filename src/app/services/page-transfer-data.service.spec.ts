import { TestBed } from '@angular/core/testing';

import { PageTransferDataService } from './page-transfer-data.service';

describe('PageTransferDataService', () => {
  let service: PageTransferDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PageTransferDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
