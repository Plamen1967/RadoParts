import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { UserHomePageComponent } from './userHomePage.component';

describe('UserHomePageComponent', () => {
  let component: UserHomePageComponent;
  let fixture: ComponentFixture<UserHomePageComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ UserHomePageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserHomePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
