import { TestBed, inject } from '@angular/core/testing';
import { PopUpService } from './popUpService.service';

describe('Service: PopUpService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PopUpService]
    });
  });

  it('should ...', inject([PopUpService], (service: PopUpService) => {
    expect(service).toBeTruthy();
  }));
});
