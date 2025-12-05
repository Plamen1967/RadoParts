import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { UpdateUserComponent } from './updateUser.component';


describe('UpdateUserComponent', () => {
  let fixture: ComponentFixture<UpdateUserComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdateUserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateUserComponent);
    fixture.detectChanges();
  });

  it('should create', () => {
    // expect(component).toBeTruthy();
  });
});
