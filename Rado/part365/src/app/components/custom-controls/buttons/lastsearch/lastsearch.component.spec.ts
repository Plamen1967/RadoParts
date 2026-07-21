import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { LastsearchComponent } from './lastsearch.component';

describe('LastsearchComponent', () => {
  let component: LastsearchComponent;
  let fixture: ComponentFixture<LastsearchComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ LastsearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LastsearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
