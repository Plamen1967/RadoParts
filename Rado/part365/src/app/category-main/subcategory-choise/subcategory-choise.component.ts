import { AfterViewInit, Component, DestroyRef, ElementRef, Input, OnInit, Self } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ControlValueAccessor, FormBuilder, FormGroup, NgControl, ReactiveFormsModule } from '@angular/forms';
import { TooltipDirective } from '@app/directive/tooltip.directive';
import { CustomSelectComponent } from '@components/custom-controls/x-custom-select/customSelect.component';
import { MultiSelectionComponent } from '@components/custom-controls/select-controls/multiSelection/multiselection.component';
import { SubCategory } from '@model/category-subcategory/subCategory';
import { OptionItem } from '@model/optionitem';
import { SubCategoryService } from '@services/category-subcategory/subCategory.service';
import { ErrorService } from '@services/error.service';

@Component({
  standalone: true,
  selector: 'app-subcategory-choise',
  templateUrl: './subcategory-choise.component.html',
  styleUrls: ['./subcategory-choise.component.css'],
    imports: [MultiSelectionComponent, TooltipDirective, CustomSelectComponent, ReactiveFormsModule],
})
export class SubcategoryChoiseComponent implements ControlValueAccessor, OnInit, AfterViewInit {
    subCategoryForm: FormGroup
    isDisabled?: boolean;
    subCategories: OptionItem[] = []
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    protected onTouched?() {}
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
    protected onChange?(_: number) {}
    @Input() all = false;
    @Input() multiselection = true
    @Input({required: true}) categoriesId!: string;
    @Input() submitted = false;
    @Input() required = false;

    constructor(
        public subCategoryService: SubCategoryService,
        private formBuilder: FormBuilder,
        @Self() public control: NgControl,
        public errorService: ErrorService,
        private element: ElementRef,
        private destroyRef: DestroyRef
    ) {
      if (this.control) this.control.valueAccessor = this
      this.subCategoryForm = formBuilder.group({
        subCategoriesId_int: [''],
      })
  }
    ngAfterViewInit(): void {
        this.subCategoryForm.controls['subCategoriesId_int'].valueChanges
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe((f) => {
            if (this.onChange) this.onChange(f)
        })
    }
    ngOnInit(): void {
        this.initCategories()
    }
    writeValue(id: number): void {
        this.subCategoryForm.patchValue({ subCategoriesId_int: id })
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

    initCategories() {
        this.subCategoryService.getSubCategoriesByCategoriesId(this.categoriesId)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe((res) => {
            const categories: SubCategory[] = [];
            res.forEach((item) => {
                let category = new SubCategory()
                category = Object.assign(category, item)
                categories?.push(category)
                item['count'] = 0
            })

            this.subCategories = categories.map((item) => {
                const cat = {
                    description: item.subCategoryName,
                    id: item.subCategoryId,
                    count: item.count!,
                    countCars: 0,
                    countParts: 0,
                    imageName: "",
                    groupModelId: 0,
                }
                return cat
            })
         })

    }
}
