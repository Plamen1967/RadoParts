import { TestBed, inject } from '@angular/core/testing';
import { TopService } from './top.service';

describe('Service: Top', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TopService]
    });
  });

  it('should ...', inject([TopService], (service: TopService) => {
    expect(service).toBeTruthy();
  }));
});
