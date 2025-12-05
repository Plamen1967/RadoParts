import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MinGroupSelectComponent } from './mingroupselect.component';

describe('MinGroupSelectComponent', () => {
  let component: MinGroupSelectComponent;
  let fixture: ComponentFixture<MinGroupSelectComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MinGroupSelectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MinGroupSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
