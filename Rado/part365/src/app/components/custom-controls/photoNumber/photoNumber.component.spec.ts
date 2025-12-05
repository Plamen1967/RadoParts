import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PhotoNumberComponent } from './photoNumber.component';

describe('PhotoNumberComponent', () => {
  let component: PhotoNumberComponent;
  let fixture: ComponentFixture<PhotoNumberComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PhotoNumberComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PhotoNumberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
