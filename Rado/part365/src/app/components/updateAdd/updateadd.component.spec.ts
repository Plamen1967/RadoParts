import {  ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { UpdateAddComponent } from './updateadd.component';


describe('UpdateAddComponent', () => {
  let component: UpdateAddComponent;
  let fixture: ComponentFixture<UpdateAddComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdateAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
