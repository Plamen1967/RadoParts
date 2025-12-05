import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import AddTyreComponent from './addTyre.component';


describe('AddTyreComponent', () => {
  let component: AddTyreComponent;
  let fixture: ComponentFixture<AddTyreComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AddTyreComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddTyreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
