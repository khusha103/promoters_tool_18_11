import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PlanogramIdealPage } from './planogram-ideal.page';

describe('PlanogramIdealPage', () => {
  let component: PlanogramIdealPage;
  let fixture: ComponentFixture<PlanogramIdealPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanogramIdealPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
