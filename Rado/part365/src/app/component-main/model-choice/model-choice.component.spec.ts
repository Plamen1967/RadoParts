import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ModelChoiceComponent } from './model-choice.component';

describe('ModelChoiceComponent', () => {
  let component: ModelChoiceComponent;
  let fixture: ComponentFixture<ModelChoiceComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ModelChoiceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModelChoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
