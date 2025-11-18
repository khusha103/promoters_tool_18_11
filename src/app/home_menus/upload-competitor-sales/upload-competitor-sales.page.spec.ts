import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UploadCompetitorSalesPage } from './upload-competitor-sales.page';

describe('UploadCompetitorSalesPage', () => {
  let component: UploadCompetitorSalesPage;
  let fixture: ComponentFixture<UploadCompetitorSalesPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadCompetitorSalesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
