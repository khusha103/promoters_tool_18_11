import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DailyPromoterChecklistPage } from './daily-promoter-checklist.page';

describe('DailyPromoterChecklistPage', () => {
  let component: DailyPromoterChecklistPage;
  let fixture: ComponentFixture<DailyPromoterChecklistPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(DailyPromoterChecklistPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
