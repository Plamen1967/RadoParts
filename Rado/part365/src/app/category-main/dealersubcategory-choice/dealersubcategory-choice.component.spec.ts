import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DealersubcategoryChoiceComponent } from './dealersubcategory-choice.component';

describe('DealersubcategoryChoiceComponent', () => {
  let component: DealersubcategoryChoiceComponent;
  let fixture: ComponentFixture<DealersubcategoryChoiceComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DealersubcategoryChoiceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DealersubcategoryChoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
