import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DatosPersonaPage } from './about-you.page';


describe('DatosPersonaPage', () => {
  let component: DatosPersonaPage;
  let fixture: ComponentFixture<DatosPersonaPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(DatosPersonaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
