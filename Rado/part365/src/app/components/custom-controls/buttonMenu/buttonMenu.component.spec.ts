import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ButtonMenuComponent } from './buttonMenu.component';

describe('ButtonMenuComponent', () => {
  let component: ButtonMenuComponent;
  let fixture: ComponentFixture<ButtonMenuComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ButtonMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ButtonMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
