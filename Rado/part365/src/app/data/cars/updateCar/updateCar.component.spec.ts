
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { UpdateCarComponent } from './updateCar.component';

describe('UpdateCarComponent', () => {
  let component: UpdateCarComponent;
  let fixture: ComponentFixture<UpdateCarComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdateCarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateCarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
