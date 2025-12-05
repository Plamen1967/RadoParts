import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DealerViewCarComponent } from './dealerviewcar.component';

describe('DisplayCarComponent', () => {
  let component: DealerViewCarComponent;
  let fixture: ComponentFixture<DealerViewCarComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DealerViewCarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DealerViewCarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
