import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DailyVmdchecklistQuesPage } from './daily-vmdchecklist-ques.page';

describe('DailyVmdchecklistQuesPage', () => {
  let component: DailyVmdchecklistQuesPage;
  let fixture: ComponentFixture<DailyVmdchecklistQuesPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(DailyVmdchecklistQuesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
