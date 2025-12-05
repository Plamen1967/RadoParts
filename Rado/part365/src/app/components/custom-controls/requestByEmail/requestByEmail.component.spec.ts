import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { RequestByEmailComponent } from './requestByEmail.component';

describe('RequestByEmailComponent', () => {
  let component: RequestByEmailComponent;
  let fixture: ComponentFixture<RequestByEmailComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ RequestByEmailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestByEmailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
