import { TestBed, inject } from '@angular/core/testing';
import { LoadingDialogService } from './loding-dialog.service';

describe('Service: LodingDialog', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LoadingDialogService]
    });
  });

  it('should ...', inject([LoadingDialogService], (service: LoadingDialogService) => {
    expect(service).toBeTruthy();
  }));
});
