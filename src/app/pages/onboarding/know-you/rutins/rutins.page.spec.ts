import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RutinsPage } from './rutins.page';

describe('RutinsPage', () => {
  let component: RutinsPage;
  let fixture: ComponentFixture<RutinsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(RutinsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
