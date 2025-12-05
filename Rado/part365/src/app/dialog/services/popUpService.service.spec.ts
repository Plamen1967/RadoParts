import { TestBed, inject } from '@angular/core/testing';
import { PopUpServiceService } from './popUpService.service';

describe('Service: PopUpService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PopUpServiceService]
    });
  });

  it('should ...', inject([PopUpServiceService], (service: PopUpServiceService) => {
    expect(service).toBeTruthy();
  }));
});
