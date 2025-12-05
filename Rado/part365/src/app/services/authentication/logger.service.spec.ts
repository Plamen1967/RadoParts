import { TestBed, inject } from '@angular/core/testing';
import { LoggerService } from './logger.service';

describe('Service: Logger', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LoggerService]
    });
  });

  it('should ...', inject([LoggerService], (service: LoggerService) => {
    expect(service).toBeTruthy();
  }));
});
