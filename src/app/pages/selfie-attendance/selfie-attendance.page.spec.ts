import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SelfieAttendancePage } from './selfie-attendance.page';

describe('SelfieAttendancePage', () => {
  let component: SelfieAttendancePage;
  let fixture: ComponentFixture<SelfieAttendancePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SelfieAttendancePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
