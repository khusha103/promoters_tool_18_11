import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OnlineExamResultPage } from './online-exam-result.page';

describe('OnlineExamResultPage', () => {
  let component: OnlineExamResultPage;
  let fixture: ComponentFixture<OnlineExamResultPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(OnlineExamResultPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
