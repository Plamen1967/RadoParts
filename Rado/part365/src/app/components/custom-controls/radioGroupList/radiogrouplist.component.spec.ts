import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { RadioGroupListComponent } from './radiogrouplist.component';

describe('RadioGroupListComponent', () => {
  let component: RadioGroupListComponent;
  let fixture: ComponentFixture<RadioGroupListComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ RadioGroupListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RadioGroupListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
