import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DailySalesPage } from './daily-sales.page';

describe('DailySalesPage', () => {
  let component: DailySalesPage;
  let fixture: ComponentFixture<DailySalesPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(DailySalesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
