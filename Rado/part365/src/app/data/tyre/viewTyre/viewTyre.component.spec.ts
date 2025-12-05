import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ViewTyreComponent } from './viewTyre.component';

describe('ViewTyreComponent', () => {
  let component: ViewTyreComponent;
  let fixture: ComponentFixture<ViewTyreComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewTyreComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewTyreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
