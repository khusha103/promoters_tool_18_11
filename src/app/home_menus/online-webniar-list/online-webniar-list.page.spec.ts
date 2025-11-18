import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OnlineWebniarListPage } from './online-webniar-list.page';

describe('OnlineWebniarListPage', () => {
  let component: OnlineWebniarListPage;
  let fixture: ComponentFixture<OnlineWebniarListPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(OnlineWebniarListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
