import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OnlineExamDetailsPage } from './online-exam-details.page';

describe('OnlineExamDetailsPage', () => {
  let component: OnlineExamDetailsPage;
  let fixture: ComponentFixture<OnlineExamDetailsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(OnlineExamDetailsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
