import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CompanyChoiseComponent } from './company-choise.component';

describe('CompanyChoiseComponent', () => {
  let component: CompanyChoiseComponent;
  let fixture: ComponentFixture<CompanyChoiseComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CompanyChoiseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyChoiseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
