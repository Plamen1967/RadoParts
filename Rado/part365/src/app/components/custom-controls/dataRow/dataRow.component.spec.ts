import {  ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DataRowComponent } from './dataRow.component';

describe('DataRowComponent', () => {
  let component: DataRowComponent;
  let fixture: ComponentFixture<DataRowComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DataRowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataRowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
