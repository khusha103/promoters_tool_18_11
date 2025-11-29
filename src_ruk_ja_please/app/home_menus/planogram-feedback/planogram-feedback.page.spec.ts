import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PlanogramFeedbackPage } from './planogram-feedback.page';

describe('PlanogramFeedbackPage', () => {
  let component: PlanogramFeedbackPage;
  let fixture: ComponentFixture<PlanogramFeedbackPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanogramFeedbackPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
