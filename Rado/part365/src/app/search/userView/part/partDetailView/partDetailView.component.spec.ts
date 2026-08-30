import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PartDetailViewComponent } from './partDetailView.component';

describe('PartDetailViewComponent', () => {
  let component: PartDetailViewComponent;
  let fixture: ComponentFixture<PartDetailViewComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PartDetailViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PartDetailViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
