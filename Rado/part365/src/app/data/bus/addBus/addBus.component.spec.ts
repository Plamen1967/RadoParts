import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import AddBusComponent from './addBus.component';


describe('AddBusComponent', () => {
  let component: AddBusComponent;
  let fixture: ComponentFixture<AddBusComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AddBusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddBusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
