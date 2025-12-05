import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TyreDetailViewComponent } from './tyreDetailView.component';

describe('TyreDetailViewComponent', () => {
  let component: TyreDetailViewComponent;
  let fixture: ComponentFixture<TyreDetailViewComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TyreDetailViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TyreDetailViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
