import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DealerUpdateComponent } from './dealerUpdate.component';

describe('DealerUpdateComponent', () => {
  let component: DealerUpdateComponent;
  let fixture: ComponentFixture<DealerUpdateComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DealerUpdateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DealerUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
