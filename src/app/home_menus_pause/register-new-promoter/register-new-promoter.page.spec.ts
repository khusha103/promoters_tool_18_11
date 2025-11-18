import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegisterNewPromoterPage } from './register-new-promoter.page';

describe('RegisterNewPromoterPage', () => {
  let component: RegisterNewPromoterPage;
  let fixture: ComponentFixture<RegisterNewPromoterPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterNewPromoterPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
