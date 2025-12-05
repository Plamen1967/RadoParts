import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { DealerViewComponent } from './dealerview.component';


describe('DealerViewComponent', () => {
  let component: DealerViewComponent;
  let fixture: ComponentFixture<DealerViewComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DealerViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DealerViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
