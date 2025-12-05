import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SuspendedComponent } from './suspended.component';

describe('SuspendedComponent', () => {
  let component: SuspendedComponent;
  let fixture: ComponentFixture<SuspendedComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SuspendedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SuspendedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
