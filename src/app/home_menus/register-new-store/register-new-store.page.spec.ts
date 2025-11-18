import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegisterNewStorePage } from './register-new-store.page';

describe('RegisterNewStorePage', () => {
  let component: RegisterNewStorePage;
  let fixture: ComponentFixture<RegisterNewStorePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterNewStorePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
