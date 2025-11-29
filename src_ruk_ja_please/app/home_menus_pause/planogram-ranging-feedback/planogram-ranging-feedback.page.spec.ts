import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PlanogramRangingFeedbackPage } from './planogram-ranging-feedback.page';

describe('PlanogramRangingFeedbackPage', () => {
  let component: PlanogramRangingFeedbackPage;
  let fixture: ComponentFixture<PlanogramRangingFeedbackPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanogramRangingFeedbackPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
