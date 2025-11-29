import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductInnerPage } from './product-inner.page';

describe('ProductInnerPage', () => {
  let component: ProductInnerPage;
  let fixture: ComponentFixture<ProductInnerPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductInnerPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
