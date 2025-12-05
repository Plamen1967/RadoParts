/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { PopService } from './pop.service';

describe('Service: Pop', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PopService]
    });
  });

  it('should ...', inject([PopService], (service: PopService) => {
    expect(service).toBeTruthy();
  }));
});
