import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SubcategoryChoiseComponent } from './subcategory-choise.component';

describe('SubcategoryChoiseComponent', () => {
  let component: SubcategoryChoiseComponent;
  let fixture: ComponentFixture<SubcategoryChoiseComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SubcategoryChoiseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubcategoryChoiseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
