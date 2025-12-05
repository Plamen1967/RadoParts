import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TyreViewComponent } from './tyreView.component';

describe('TyreViewComponent', () => {
  let component: TyreViewComponent;
  let fixture: ComponentFixture<TyreViewComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TyreViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TyreViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
