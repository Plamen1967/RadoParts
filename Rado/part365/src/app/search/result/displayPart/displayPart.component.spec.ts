import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DisplayPartComponent } from './displayPart.component';

describe('DisplayPartComponent', () => {
  let component: DisplayPartComponent;
  let fixture: ComponentFixture<DisplayPartComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DisplayPartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DisplayPartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
