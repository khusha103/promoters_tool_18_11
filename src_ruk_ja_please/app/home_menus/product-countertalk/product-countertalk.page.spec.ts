import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductCountertalkPage } from './product-countertalk.page';

describe('ProductCountertalkPage', () => {
  let component: ProductCountertalkPage;
  let fixture: ComponentFixture<ProductCountertalkPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductCountertalkPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
