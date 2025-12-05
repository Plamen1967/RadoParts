import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CatchaComponent } from './catcha.component';

describe('CatchaComponent', () => {
  let component: CatchaComponent;
  let fixture: ComponentFixture<CatchaComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CatchaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CatchaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
