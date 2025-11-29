import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PromoterKpiInnerPage } from './promoter-kpi-inner.page';

describe('PromoterKpiInnerPage', () => {
  let component: PromoterKpiInnerPage;
  let fixture: ComponentFixture<PromoterKpiInnerPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PromoterKpiInnerPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
