import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { UserViewPartComponent } from './userViewPart.component';

describe('UserViewPartComponent', () => {
  let component: UserViewPartComponent;
  let fixture: ComponentFixture<UserViewPartComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ UserViewPartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserViewPartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
