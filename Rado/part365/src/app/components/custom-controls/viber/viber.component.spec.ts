import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViberComponent } from './viber.component';

describe('ViberComponent', () => {
  let component: ViberComponent;
  let fixture: ComponentFixture<ViberComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ViberComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
