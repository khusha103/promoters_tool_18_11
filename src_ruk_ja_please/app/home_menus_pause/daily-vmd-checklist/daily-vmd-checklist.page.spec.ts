import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DailyVmdChecklistPage } from './daily-vmd-checklist.page';

describe('DailyVmdChecklistPage', () => {
  let component: DailyVmdChecklistPage;
  let fixture: ComponentFixture<DailyVmdChecklistPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(DailyVmdChecklistPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
