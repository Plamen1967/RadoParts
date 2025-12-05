import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MinModelComponent } from './minmodel.component';

describe('MinModelComponent', () => {
  let component: MinModelComponent;
  let fixture: ComponentFixture<MinModelComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MinModelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MinModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
