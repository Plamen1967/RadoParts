import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DealerWebPageComponent } from './dealerWebPage.component';

describe('DealerWebPageComponent', () => {
  let component: DealerWebPageComponent;
  let fixture: ComponentFixture<DealerWebPageComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DealerWebPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DealerWebPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
