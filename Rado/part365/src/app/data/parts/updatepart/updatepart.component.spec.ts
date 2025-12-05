import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { UpdatePartComponent } from './updatepart.component';


describe('UpdatepartComponent', () => {
  let component: UpdatePartComponent;
  let fixture: ComponentFixture<UpdatePartComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdatePartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdatePartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
