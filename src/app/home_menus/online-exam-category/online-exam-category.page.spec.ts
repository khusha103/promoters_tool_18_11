import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OnlineExamCategoryPage } from './online-exam-category.page';

describe('OnlineExamCategoryPage', () => {
  let component: OnlineExamCategoryPage;
  let fixture: ComponentFixture<OnlineExamCategoryPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(OnlineExamCategoryPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
