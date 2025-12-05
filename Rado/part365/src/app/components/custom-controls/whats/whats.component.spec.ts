import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { WhatsComponent } from './whats.component';

describe('WhatsComponent', () => {
  let component: WhatsComponent;
  let fixture: ComponentFixture<WhatsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ WhatsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WhatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
