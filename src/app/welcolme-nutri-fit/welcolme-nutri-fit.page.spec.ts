import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WelcolmeNutriFitPage } from './welcolme-nutri-fit.page';

describe('WelcolmeNutriFitPage', () => {
  let component: WelcolmeNutriFitPage;
  let fixture: ComponentFixture<WelcolmeNutriFitPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(WelcolmeNutriFitPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
