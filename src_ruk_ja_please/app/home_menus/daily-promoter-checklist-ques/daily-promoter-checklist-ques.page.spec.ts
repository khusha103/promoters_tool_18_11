import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DailyPromoterChecklistQuesPage } from './daily-promoter-checklist-ques.page';

describe('DailyPromoterChecklistQuesPage', () => {
  let component: DailyPromoterChecklistQuesPage;
  let fixture: ComponentFixture<DailyPromoterChecklistQuesPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(DailyPromoterChecklistQuesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
