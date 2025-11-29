import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegisterNewRetailerPage } from './register-new-retailer.page';

describe('RegisterNewRetailerPage', () => {
  let component: RegisterNewRetailerPage;
  let fixture: ComponentFixture<RegisterNewRetailerPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterNewRetailerPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
