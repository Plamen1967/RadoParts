import { TestBed, inject } from '@angular/core/testing';
import { StaticSelectionService } from './staticSelection.service';

describe('Service: StaticSelection', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [StaticSelectionService]
    });
  });

  it('should ...', inject([StaticSelectionService], (service: StaticSelectionService) => {
    expect(service).toBeTruthy();
  }));
});
