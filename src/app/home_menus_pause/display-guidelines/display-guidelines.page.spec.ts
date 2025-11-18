import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DisplayGuidelinesPage } from './display-guidelines.page';

describe('DisplayGuidelinesPage', () => {
  let component: DisplayGuidelinesPage;
  let fixture: ComponentFixture<DisplayGuidelinesPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(DisplayGuidelinesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
