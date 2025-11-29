import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OnlineWebniarScreenPage } from './online-webniar-screen.page';

describe('OnlineWebniarScreenPage', () => {
  let component: OnlineWebniarScreenPage;
  let fixture: ComponentFixture<OnlineWebniarScreenPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(OnlineWebniarScreenPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
