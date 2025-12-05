import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import ListPartComponent from './listpart.component';


describe('SearchPartComponent', () => {
  let component: ListPartComponent;
  let fixture: ComponentFixture<ListPartComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ListPartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListPartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
