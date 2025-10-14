import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ObjectivePage } from './objective.page';

describe('ObjectivePage', () => {
  let component: ObjectivePage;
  let fixture: ComponentFixture<ObjectivePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ObjectivePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
