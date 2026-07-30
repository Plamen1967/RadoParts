import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DealerSubCategoryComponent } from './dealerSubCategory.component';

describe('DealerSubCategoryComponent', () => {
  let component: DealerSubCategoryComponent;
  let fixture: ComponentFixture<DealerSubCategoryComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DealerSubCategoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DealerSubCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
