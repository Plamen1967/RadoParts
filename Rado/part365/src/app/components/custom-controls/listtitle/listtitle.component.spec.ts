import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ListTitleComponent } from './listtitle.component';


describe('ListTitleComponent', () => {
  let component: ListTitleComponent;
  let fixture: ComponentFixture<ListTitleComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ListTitleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListTitleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
