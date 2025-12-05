import { TestBed, inject } from '@angular/core/testing';
import { ModificationService } from './modification.service';

describe('Service: Modification', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ModificationService]
    });
  });

  it('should ...', inject([ModificationService], (service: ModificationService) => {
    expect(service).toBeTruthy();
  }));
});
