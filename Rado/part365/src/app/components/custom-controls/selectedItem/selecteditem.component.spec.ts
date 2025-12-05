import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SelectedItemComponent } from './selecteditem.component';

describe('SelectedItemComponent', () => {
  let component: SelectedItemComponent;
  let fixture: ComponentFixture<SelectedItemComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectedItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectedItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
