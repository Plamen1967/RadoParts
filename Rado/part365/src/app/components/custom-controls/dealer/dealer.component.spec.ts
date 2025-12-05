import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DealerComponent } from './dealer.component';

describe('DealerComponent', () => {
  let component: DealerComponent;
  let fixture: ComponentFixture<DealerComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DealerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DealerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
