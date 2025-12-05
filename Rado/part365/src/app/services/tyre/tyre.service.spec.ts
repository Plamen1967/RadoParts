import { TestBed, inject } from '@angular/core/testing';
import { TyreService } from './tyre.service';

describe('Service: Tyre', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TyreService]
    });
  });

  it('should ...', inject([TyreService], (service: TyreService) => {
    expect(service).toBeTruthy();
  }));
});
