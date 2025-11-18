import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PromoterRankingPage } from './promoter-ranking.page';

describe('PromoterRankingPage', () => {
  let component: PromoterRankingPage;
  let fixture: ComponentFixture<PromoterRankingPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PromoterRankingPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
