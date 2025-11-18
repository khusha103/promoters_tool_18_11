import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OnlineSurveyFeedbackPage } from './online-survey-feedback.page';

describe('OnlineSurveyFeedbackPage', () => {
  let component: OnlineSurveyFeedbackPage;
  let fixture: ComponentFixture<OnlineSurveyFeedbackPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(OnlineSurveyFeedbackPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
