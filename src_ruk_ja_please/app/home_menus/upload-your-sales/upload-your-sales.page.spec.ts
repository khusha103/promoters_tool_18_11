import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UploadYourSalesPage } from './upload-your-sales.page';

describe('UploadYourSalesPage', () => {
  let component: UploadYourSalesPage;
  let fixture: ComponentFixture<UploadYourSalesPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadYourSalesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
