import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ListTyreComponent } from './listTyre.component';

describe('ListTyreComponent', () => {
  let component: ListTyreComponent;
  let fixture: ComponentFixture<ListTyreComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ListTyreComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListTyreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
