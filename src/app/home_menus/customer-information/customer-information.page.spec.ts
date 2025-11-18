import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CustomerInformationPage } from './customer-information.page';

describe('CustomerInformationPage', () => {
  let component: CustomerInformationPage;
  let fixture: ComponentFixture<CustomerInformationPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerInformationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
