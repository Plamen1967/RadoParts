import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import ViewCarComponent from './viewCar.component';


describe('ViewCarComponent', () => {
  let component: ViewCarComponent;
  let fixture: ComponentFixture<ViewCarComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewCarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewCarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
