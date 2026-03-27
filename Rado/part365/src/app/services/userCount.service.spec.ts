import { TestBed, inject } from '@angular/core/testing';
import { UserCountService } from './userCount.service';

describe('Service: UserCount', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UserCountService]
    });
  });

  it('should ...', inject([UserCountService], (service: UserCountService) => {
    expect(service).toBeTruthy();
  }));
});
