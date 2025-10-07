import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreateAccPage } from './register.page';
import { IonicModule } from '@ionic/angular';

describe('CreateAccPage', () => {
  let component: CreateAccPage;
  let fixture: ComponentFixture<CreateAccPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
          declarations: [CreateAccPage],
          imports: [IonicModule.forRoot()]
        }).compileComponents();
    
        fixture = TestBed.createComponent(CreateAccPage);
        component = fixture.componentInstance;
        fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
