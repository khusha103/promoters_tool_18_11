import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OnlineExamsPage } from './online-exams.page';

describe('OnlineExamsPage', () => {
  let component: OnlineExamsPage;
  let fixture: ComponentFixture<OnlineExamsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(OnlineExamsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
