import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ModificationChoiceComponent } from './modification-choice.component';

describe('ModificationChoiceComponent', () => {
  let component: ModificationChoiceComponent;
  let fixture: ComponentFixture<ModificationChoiceComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ModificationChoiceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModificationChoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
