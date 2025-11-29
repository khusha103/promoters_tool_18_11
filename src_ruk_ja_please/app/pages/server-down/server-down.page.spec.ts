import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ServerDownPage } from './server-down.page';

describe('ServerDownPage', () => {
  let component: ServerDownPage;
  let fixture: ComponentFixture<ServerDownPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ServerDownPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
