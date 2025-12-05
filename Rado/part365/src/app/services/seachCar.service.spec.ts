import { TestBed, inject } from '@angular/core/testing';
import { SeachCarService } from './seachCar.service';

describe('Service: SeachCar', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SeachCarService]
    });
  });

  it('should ...', inject([SeachCarService], (service: SeachCarService) => {
    expect(service).toBeTruthy();
  }));
});
