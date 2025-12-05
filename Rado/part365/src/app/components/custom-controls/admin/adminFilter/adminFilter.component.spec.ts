import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AdminFilterComponent } from './adminFilter.component';

describe('AdminFilterComponent', () => {
  let component: AdminFilterComponent;
  let fixture: ComponentFixture<AdminFilterComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
