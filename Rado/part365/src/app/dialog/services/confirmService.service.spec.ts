import { TestBed, inject } from '@angular/core/testing';
import { ConfirmServiceService } from './confirmService.service';

describe('Service: ConfirmService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ConfirmServiceService]
    });
  });

  it('should ...', inject([ConfirmServiceService], (service: ConfirmServiceService) => {
    expect(service).toBeTruthy();
  }));
});
