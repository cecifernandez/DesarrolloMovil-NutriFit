import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PrimaryButtonWithIconComponent } from './primary-button-with-icon.component';

describe('PrimaryButtonWithIconComponent', () => {
  let component: PrimaryButtonWithIconComponent;
  let fixture: ComponentFixture<PrimaryButtonWithIconComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PrimaryButtonWithIconComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PrimaryButtonWithIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
