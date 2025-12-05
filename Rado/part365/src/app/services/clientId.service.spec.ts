
import { TestBed, inject } from '@angular/core/testing';
import { ClientIdService } from './clientId.service';

describe('Service: ClientId', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ClientIdService]
    });
  });

  it('should ...', inject([ClientIdService], (service: ClientIdService) => {
    expect(service).toBeTruthy();
  }));
});
