import { AfterViewInit, Component, DestroyRef, ElementRef, EventEmitter, Input, Output, Self } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ControlValueAccessor, FormBuilder, FormGroup, NgControl, ReactiveFormsModule } from '@angular/forms';
import { TooltipDirective } from '@app/directive/tooltip.directive';
import { CustomSelectComponent } from '@components/custom-controls/x-custom-select/customSelect.component';
import { DealerSubCategory } from '@model/category-subcategory/dealerSubCategory';
import { OptionItem } from '@model/optionitem';
import { DealerSubCategoryService } from '@services/category-subcategory/dealerSubCategory.service';
import { ErrorService } from '@services/error.service';

@Component({
  standalone: true,
  selector: 'app-dealersubcategory-choice',
  templateUrl: './dealersubcategory-choice.component.html',
  styleUrls: ['./dealersubcategory-choice.component.css'],
  imports: [TooltipDirective, CustomSelectComponent, ReactiveFormsModule]
})
export class DealersubcategoryChoiceComponent implements ControlValueAccessor, AfterViewInit {
    dealerSubCategoryForm: FormGroup
    isDisabled?: boolean;
    dealerSubCategories: OptionItem[] = []
    dealercategories: DealerSubCategory[] = [];

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    protected onTouched?() {}
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
    protected onChange?(_: number) {}
    @Input() all = false;
    @Input() multiselection = true
    @Input({required: true}) set categoryId(value: number){ 
        this.initCategories(value)
    }
    @Input() submitted = false;
    @Input() required = false;
    @Output() dealerSubCategoryChanged: EventEmitter<DealerSubCategory> = new EventEmitter<DealerSubCategory>()

    constructor(
        public dealerSubCategoryService: DealerSubCategoryService,
        private formBuilder: FormBuilder,
        @Self() public control: NgControl,
        public errorService: ErrorService,
        private element: ElementRef,
        private destroyRef: DestroyRef
    ) {
      if (this.control) this.control.valueAccessor = this
        this.dealerSubCategoryForm = formBuilder.group({
          dealerSubCategoriesId_int: [''],
      })
  }
    ngAfterViewInit(): void {
        this.dealerSubCategoryForm.controls['dealerSubCategoriesId_int'].valueChanges
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((f) => {
            const dealerSubCategory = this.dealercategories.find(item => item.dealerSubCategoryId === f);
            this.dealerSubCategoryChanged.emit(dealerSubCategory);
            if (this.onChange) this.onChange(f)
        })
    }
    writeValue(id: number): void {
        this.dealerSubCategoryForm.patchValue({ dealerSubCategoriesId_int: id })
    }
    registerOnChange(fn: (_: unknown) => unknown): void {
        this.onChange = fn
    }
    registerOnTouched(fn: () => unknown): void {
        this.onTouched = fn
    }

    setDisabledState?(isDisabled: boolean): void {
        this.isDisabled = isDisabled
    }

    initCategories(categoryId: number) {
        if (categoryId) {
            this.dealerSubCategoryService.fetchByCategory(categoryId)
                .pipe(takeUntilDestroyed(this.destroyRef))
                .subscribe((res) => {
                this.dealercategories = [...res]
    
                this.dealerSubCategories = this.dealercategories.map((item) => {
                    const cat = {
                        description: item.dealerSubCategoryName,
                        id: item.dealerSubCategoryId,
                        count: 0,
                        countCars: 0,
                        countParts: 0,
                        imageName: "",
                        groupModelId: 0,
                    }
                    return cat
                })
             })
            }
            else {
                this.dealerSubCategories = [];    
            }
            this.dealerSubCategories?.unshift({ id: 0, description: 'Избери Подкатегория Дилър', count: 0, countCars: 0, countParts: 0, groupModelId: 0 })

    }
}
