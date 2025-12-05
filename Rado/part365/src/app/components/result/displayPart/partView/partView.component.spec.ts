import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PartViewComponent } from './partView.component';

describe('PartViewComponent', () => {
  let component: PartViewComponent;
  let fixture: ComponentFixture<PartViewComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PartViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PartViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
