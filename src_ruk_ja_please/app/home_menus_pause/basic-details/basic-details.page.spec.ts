import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BasicDetailsPage } from './basic-details.page';

describe('BasicDetailsPage', () => {
  let component: BasicDetailsPage;
  let fixture: ComponentFixture<BasicDetailsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(BasicDetailsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
