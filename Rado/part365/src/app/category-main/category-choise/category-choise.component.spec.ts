import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CategoryChoiseComponent } from './category-choise.component';

describe('CategoryChoiseComponent', () => {
  let component: CategoryChoiseComponent;
  let fixture: ComponentFixture<CategoryChoiseComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CategoryChoiseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CategoryChoiseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
