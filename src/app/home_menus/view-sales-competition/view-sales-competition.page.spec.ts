import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ViewSalesCompetitionPage } from './view-sales-competition.page';

describe('ViewSalesCompetitionPage', () => {
  let component: ViewSalesCompetitionPage;
  let fixture: ComponentFixture<ViewSalesCompetitionPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewSalesCompetitionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
