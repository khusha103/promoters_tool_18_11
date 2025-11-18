import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppSelectorPage } from './app-selector.page';

describe('AppSelectorPage', () => {
  let component: AppSelectorPage;
  let fixture: ComponentFixture<AppSelectorPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AppSelectorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
