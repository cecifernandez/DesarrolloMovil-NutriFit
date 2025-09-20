import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginNutrifitPage } from './login-nutrifit.page';
import { IonicModule } from '@ionic/angular';


describe('LoginNutrifitPage', () => {
  let component: LoginNutrifitPage;
  let fixture: ComponentFixture<LoginNutrifitPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
          declarations: [LoginNutrifitPage],
          imports: [IonicModule.forRoot()]
        }).compileComponents();

    fixture = TestBed.createComponent(LoginNutrifitPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
