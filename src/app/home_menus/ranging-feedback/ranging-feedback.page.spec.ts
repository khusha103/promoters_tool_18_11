import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RangingFeedbackPage } from './ranging-feedback.page';

describe('RangingFeedbackPage', () => {
  let component: RangingFeedbackPage;
  let fixture: ComponentFixture<RangingFeedbackPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(RangingFeedbackPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
