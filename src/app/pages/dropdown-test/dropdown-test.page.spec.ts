import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DropdownTestPage } from './dropdown-test.page';

describe('DropdownTestPage', () => {
  let component: DropdownTestPage;
  let fixture: ComponentFixture<DropdownTestPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(DropdownTestPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
