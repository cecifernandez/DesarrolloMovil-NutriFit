import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WelcomeNutriFitPage } from './welcome-nutri-fit.page';

describe('WelcomeNutriFitPage', () => {
  let component: WelcomeNutriFitPage;
  let fixture: ComponentFixture<WelcomeNutriFitPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(WelcomeNutriFitPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
