import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { TyreFilterComponent } from './tyrefilter.component';


describe('TyreFilterComponent', () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let component: TyreFilterComponent;
  let fixture: ComponentFixture<TyreFilterComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TyreFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TyreFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    // expect(component).toBeTruthy();
  });
});
