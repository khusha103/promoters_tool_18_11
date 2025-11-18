import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PlanogramAreaPage } from './planogram-area.page';

describe('PlanogramAreaPage', () => {
  let component: PlanogramAreaPage;
  let fixture: ComponentFixture<PlanogramAreaPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanogramAreaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
