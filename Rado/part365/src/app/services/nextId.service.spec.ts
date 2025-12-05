import { TestBed, inject } from '@angular/core/testing';
import { NextIdService } from './nextId.service';

describe('Service: NextId', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NextIdService]
    });
  });

  it('should ...', inject([NextIdService], (service: NextIdService) => {
    expect(service).toBeTruthy();
  }));
});
