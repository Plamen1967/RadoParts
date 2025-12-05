import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import BusComponent from './bus.component';


describe('BusComponent', () => {
  let component: BusComponent;
  let fixture: ComponentFixture<BusComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ BusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
