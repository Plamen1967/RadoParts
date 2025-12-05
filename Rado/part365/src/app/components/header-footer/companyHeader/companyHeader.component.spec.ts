import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CompanyHeaderComponent } from './companyHeader.component';

describe('CompanyHeaderComponent', () => {
  let component: CompanyHeaderComponent;
  let fixture: ComponentFixture<CompanyHeaderComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CompanyHeaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
