import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PromoterScorePage } from './promoter-score.page';

describe('PromoterScorePage', () => {
  let component: PromoterScorePage;
  let fixture: ComponentFixture<PromoterScorePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PromoterScorePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
