import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FitnessPage } from './fitness.page';

describe('FitnessPage', () => {
  let component: FitnessPage;
  let fixture: ComponentFixture<FitnessPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(FitnessPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
