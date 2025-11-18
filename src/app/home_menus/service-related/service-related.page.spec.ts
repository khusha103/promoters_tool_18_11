import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ServiceRelatedPage } from './service-related.page';

describe('ServiceRelatedPage', () => {
  let component: ServiceRelatedPage;
  let fixture: ComponentFixture<ServiceRelatedPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ServiceRelatedPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
