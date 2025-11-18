import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OnlineExamQuesPage } from './online-exam-ques.page';

describe('OnlineExamQuesPage', () => {
  let component: OnlineExamQuesPage;
  let fixture: ComponentFixture<OnlineExamQuesPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(OnlineExamQuesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
