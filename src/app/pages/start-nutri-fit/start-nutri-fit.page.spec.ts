import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StartNutriFitPage } from './start-nutri-fit.page';

describe('StartNutriFitPage', () => {
  let component: StartNutriFitPage;
  let fixture: ComponentFixture<StartNutriFitPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(StartNutriFitPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
