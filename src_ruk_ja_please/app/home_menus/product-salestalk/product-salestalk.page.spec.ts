import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductSalestalkPage } from './product-salestalk.page';

describe('ProductSalestalkPage', () => {
  let component: ProductSalestalkPage;
  let fixture: ComponentFixture<ProductSalestalkPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductSalestalkPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
