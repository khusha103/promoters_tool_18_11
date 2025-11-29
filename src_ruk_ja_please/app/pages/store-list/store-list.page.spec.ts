import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StoreListPage } from './store-list.page';

describe('StoreListPage', () => {
  let component: StoreListPage;
  let fixture: ComponentFixture<StoreListPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(StoreListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
