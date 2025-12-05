import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { RowPartDealerComponent } from './rowPartDealer.component';

describe('RowPartDealerComponent', () => {
  let component: RowPartDealerComponent;
  let fixture: ComponentFixture<RowPartDealerComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ RowPartDealerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RowPartDealerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
