import { TestBed, inject } from '@angular/core/testing';
import { MessageService as MessageService } from './messageService';

describe('Service: MessageService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MessageService]
    });
  });

  it('should ...', inject([MessageService], (service: MessageService) => {
    expect(service).toBeTruthy();
  }));
});
