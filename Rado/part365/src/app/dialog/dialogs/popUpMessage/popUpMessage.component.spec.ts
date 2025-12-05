import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PopUpMessageComponent } from './popUpMessage.component';

describe('PopUpMessageComponent', () => {
  let component: PopUpMessageComponent;
  let fixture: ComponentFixture<PopUpMessageComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PopUpMessageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PopUpMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
