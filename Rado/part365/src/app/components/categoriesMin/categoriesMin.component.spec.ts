import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoriesMinComponent } from './categoriesMin.component';

describe('CategoriesMinComponent', () => {
  let component: CategoriesMinComponent;
  let fixture: ComponentFixture<CategoriesMinComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ CategoriesMinComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CategoriesMinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
