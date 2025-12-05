import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MultiSelectionComponent } from './multiselection.component';

describe('MultiSelectionComponent', () => {
  let component: MultiSelectionComponent;
  let fixture: ComponentFixture<MultiSelectionComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MultiSelectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MultiSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
