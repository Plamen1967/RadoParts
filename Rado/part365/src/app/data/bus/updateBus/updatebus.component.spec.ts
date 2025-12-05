import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import UpdateBusComponent from './updatebus.component';


describe('UpdateBusComponent', () => {
  let component: UpdateBusComponent;
  let fixture: ComponentFixture<UpdateBusComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdateBusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateBusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
