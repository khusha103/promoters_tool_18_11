import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LatestNewsPage } from './latest-news.page';

describe('LatestNewsPage', () => {
  let component: LatestNewsPage;
  let fixture: ComponentFixture<LatestNewsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(LatestNewsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
