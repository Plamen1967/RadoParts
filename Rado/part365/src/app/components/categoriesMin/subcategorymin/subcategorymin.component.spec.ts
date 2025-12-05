import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SubcategoryminComponent } from './subcategorymin.component';

describe('SubcategoryminComponent', () => {
  let component: SubcategoryminComponent;
  let fixture: ComponentFixture<SubcategoryminComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SubcategoryminComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubcategoryminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
