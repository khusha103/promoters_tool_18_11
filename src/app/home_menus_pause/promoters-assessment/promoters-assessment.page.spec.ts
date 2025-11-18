import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PromotersAssessmentPage } from './promoters-assessment.page';

describe('PromotersAssessmentPage', () => {
  let component: PromotersAssessmentPage;
  let fixture: ComponentFixture<PromotersAssessmentPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PromotersAssessmentPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
