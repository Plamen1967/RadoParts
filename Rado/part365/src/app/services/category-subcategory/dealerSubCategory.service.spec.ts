import { TestBed, inject } from '@angular/core/testing';
import { DealerSubCategoryService } from './dealerSubCategory.service';

describe('Service: DealerSubCategory', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DealerSubCategoryService]
    });
  });

  it('should ...', inject([DealerSubCategoryService], (service: DealerSubCategoryService) => {
    expect(service).toBeTruthy();
  }));
});
