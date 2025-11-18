import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PlanogramFeedbackFormPage } from './planogram-feedback-form.page';

describe('PlanogramFeedbackFormPage', () => {
  let component: PlanogramFeedbackFormPage;
  let fixture: ComponentFixture<PlanogramFeedbackFormPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanogramFeedbackFormPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
