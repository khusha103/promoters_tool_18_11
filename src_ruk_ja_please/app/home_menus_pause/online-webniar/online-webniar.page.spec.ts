import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OnlineWebniarPage } from './online-webniar.page';

describe('OnlineWebniarPage', () => {
  let component: OnlineWebniarPage;
  let fixture: ComponentFixture<OnlineWebniarPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(OnlineWebniarPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
