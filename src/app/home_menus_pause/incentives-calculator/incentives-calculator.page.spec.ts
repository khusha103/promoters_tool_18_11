import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IncentivesCalculatorPage } from './incentives-calculator.page';

describe('IncentivesCalculatorPage', () => {
  let component: IncentivesCalculatorPage;
  let fixture: ComponentFixture<IncentivesCalculatorPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(IncentivesCalculatorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
