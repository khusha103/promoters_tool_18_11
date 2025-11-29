import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PlanogramRangingPage } from './planogram-ranging.page';

describe('PlanogramRangingPage', () => {
  let component: PlanogramRangingPage;
  let fixture: ComponentFixture<PlanogramRangingPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanogramRangingPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
