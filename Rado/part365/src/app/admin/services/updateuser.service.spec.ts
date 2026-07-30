import { TestBed,  inject } from '@angular/core/testing';
import { UpdateUserService } from './updateuser.service';

describe('Service: Updateuser', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UpdateUserService]
    });
  });

  it('should ...', inject([UpdateUserService], (service: UpdateUserService) => {
    expect(service).toBeTruthy();
  }));
});
