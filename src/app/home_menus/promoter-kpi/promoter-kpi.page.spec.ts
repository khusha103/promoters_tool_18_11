import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PromoterKpiPage } from './promoter-kpi.page';

describe('PromoterKpiPage', () => {
  let component: PromoterKpiPage;
  let fixture: ComponentFixture<PromoterKpiPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PromoterKpiPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
