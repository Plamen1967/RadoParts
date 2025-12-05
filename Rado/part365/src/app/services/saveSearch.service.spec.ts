import { TestBed, inject } from '@angular/core/testing';
import { SaveSearchService } from './saveSearch.service';

describe('Service: SaveSearch', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SaveSearchService]
    });
  });

  it('should ...', inject([SaveSearchService], (service: SaveSearchService) => {
    expect(service).toBeTruthy();
  }));
});
