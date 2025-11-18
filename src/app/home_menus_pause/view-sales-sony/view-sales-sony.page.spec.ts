import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ViewSalesSonyPage } from './view-sales-sony.page';

describe('ViewSalesSonyPage', () => {
  let component: ViewSalesSonyPage;
  let fixture: ComponentFixture<ViewSalesSonyPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewSalesSonyPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
