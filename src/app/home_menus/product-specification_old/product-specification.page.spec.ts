import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductSpecificationPage } from './product-specification.page';

describe('ProductSpecificationPage', () => {
  let component: ProductSpecificationPage;
  let fixture: ComponentFixture<ProductSpecificationPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductSpecificationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
