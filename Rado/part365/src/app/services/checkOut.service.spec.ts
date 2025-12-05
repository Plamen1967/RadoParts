import { TestBed, inject } from '@angular/core/testing';
import { CheckOutService } from './checkOut.service';

describe('Service: CheckOut', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CheckOutService]
    });
  });

  it('should ...', inject([CheckOutService], (service: CheckOutService) => {
    expect(service).toBeTruthy();
  }));
});
