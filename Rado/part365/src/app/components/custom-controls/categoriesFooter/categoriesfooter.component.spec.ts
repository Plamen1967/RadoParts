import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoriesFooterComponent } from './categoriesfooter.component';

describe('CategoriesFooterComponent', () => {
  let component: CategoriesFooterComponent;
  let fixture: ComponentFixture<CategoriesFooterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ CategoriesFooterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CategoriesFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
