import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SecondaryButtonWithIconComponent } from './secondary-button-with-icon.component';

describe('SecondaryButtonWithIconComponent', () => {
  let component: SecondaryButtonWithIconComponent;
  let fixture: ComponentFixture<SecondaryButtonWithIconComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SecondaryButtonWithIconComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SecondaryButtonWithIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
