import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import AddPartComponent from './addpart.component';


describe('AddPartComponent', () => {
  let component: AddPartComponent;
  let fixture: ComponentFixture<AddPartComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AddPartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddPartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
