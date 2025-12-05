import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { UpdateTyreComponent } from './updateTyre.component';

describe('UpdateTyreComponent', () => {
  let component: UpdateTyreComponent;
  let fixture: ComponentFixture<UpdateTyreComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdateTyreComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateTyreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
