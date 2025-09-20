import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreateAccPage } from './create-acc.page';
import { IonicModule } from '@ionic/angular';

import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';


describe('CreateAccPage', () => {
  let component: CreateAccPage;
  let fixture: ComponentFixture<CreateAccPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
          declarations: [CreateAccPage],
          imports: [IonicModule.forRoot(), ExploreContainerComponentModule]
        }).compileComponents();
    
        fixture = TestBed.createComponent(CreateAccPage);
        component = fixture.componentInstance;
        fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
