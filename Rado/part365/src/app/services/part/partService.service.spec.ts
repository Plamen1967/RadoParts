import { TestBed, inject } from '@angular/core/testing';
import { PartServiceService } from './partService.service';

describe('Service: PartService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PartServiceService]
    });
  });

  it('should ...', inject([PartServiceService], (service: PartServiceService) => {
    expect(service).toBeTruthy();
  }));
});
