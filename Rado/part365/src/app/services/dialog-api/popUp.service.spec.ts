import { TestBed, inject } from '@angular/core/testing';
import { PopUpService } from './popUp.service';

describe('Service: PopUp', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PopUpService]
    });
  });

  it('should ...', inject([PopUpService], (service: PopUpService) => {
    expect(service).toBeTruthy();
  }));
});
