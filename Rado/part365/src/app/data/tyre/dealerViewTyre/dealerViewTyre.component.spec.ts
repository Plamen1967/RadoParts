import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DealerViewTyreComponent } from './dealerViewTyre.component';

describe('DealerViewTyreComponent', () => {
  let component: DealerViewTyreComponent;
  let fixture: ComponentFixture<DealerViewTyreComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DealerViewTyreComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DealerViewTyreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
