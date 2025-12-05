import { TestBed, inject } from '@angular/core/testing';
import { SearchPartService } from './searchPart.service';

describe('Service: SearchPart', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SearchPartService]
    });
  });

  it('should ...', inject([SearchPartService], (service: SearchPartService) => {
    expect(service).toBeTruthy();
  }));
});
