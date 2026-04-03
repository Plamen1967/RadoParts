import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ShowfilterComponent } from './showfilter.component';

describe('ShowfilterComponent', () => {
  let component: ShowfilterComponent;
  let fixture: ComponentFixture<ShowfilterComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ShowfilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowfilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
