import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ClearbuttonComponent } from './clearbutton.component';

describe('ClearbuttonComponent', () => {
  let component: ClearbuttonComponent;
  let fixture: ComponentFixture<ClearbuttonComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ClearbuttonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClearbuttonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
