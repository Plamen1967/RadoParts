//#region imports
import { Component, DestroyRef, ElementRef, inject, Input, OnInit, Self, ChangeDetectionStrategy } from '@angular/core'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { ControlValueAccessor, FormBuilder, FormGroup, NgControl, ReactiveFormsModule } from '@angular/forms'
import { TooltipDirective } from '@app/directive/tooltip.directive'
import { CustomSelectComponent } from '@components/custom-controls/x-custom-select/customSelect.component'
import { MultiSelectionComponent } from '@components/custom-controls/select-controls/multiSelection/multiselection.component'
import { Category } from '@model/category-subcategory/category'
import { OptionItem } from '@model/optionitem'
import { CategoryService } from '@services/category-subcategory/category.service'
import { ErrorService } from '@services/error.service'
//#endregion
//#region component
@Component({
    selector: 'app-category-choise',
    templateUrl: './category-choise.component.html',
    styleUrls: ['./category-choise.component.css'],
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [MultiSelectionComponent, TooltipDirective, CustomSelectComponent, ReactiveFormsModule],
})
//#endregion
export class CategoryChoiseComponent implements ControlValueAccessor, OnInit {
    //#region variables and services
    categoryForm: FormGroup
    isDisabled?: boolean
    categories: OptionItem[] = []
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    protected onTouched?() {}
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
    protected onChange?(_: number) {}
    @Input() all = false
    @Input() multiselection = true
    @Input() submitted = false
    @Input() required = false
    //#region services
    public categoryService: CategoryService
    private formBuilder: FormBuilder
    @Self() public control: NgControl
    public errorService: ErrorService
    private element: ElementRef
    private destroyRef: DestroyRef
    //#endregion
    //#endregion

    constructor() {
        this.categoryService = inject(CategoryService)
        this.formBuilder = inject(FormBuilder)
        this.control = inject(NgControl)
        this.errorService = inject(ErrorService)
        this.element = inject(ElementRef)
        this.destroyRef = inject(DestroyRef)

        if (this.control) this.control.valueAccessor = this
        this.categoryForm = this.formBuilder.group({
            categoriesId_int: [''],
        })
    }
    ngOnInit(): void {
        this.categoryForm.controls['categoriesId_int'].valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((f) => {
            if (this.onChange) this.onChange(f)
        })
        this.initCategories()
    }

    writeValue(id: number): void {
        this.categoryForm.patchValue({ categoriesId_int: id })
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
        this.categoryService
            .fetch()
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((res) => {
                const categories: Category[] = []
                res.forEach((item) => {
                    let category = new Category()
                    category = Object.assign(category, item)
                    categories?.push(category)
                    item['count'] = 0
                })

                this.categories = categories.map((item) => {
                    const cat = {
                        description: item.categoryName,
                        id: item.categoryId,
                        count: item.count,
                        countCars: 0,
                        countParts: 0,
                        imageName: item.imageName,
                        groupModelId: 0,
                    }
                    return cat
                })
                this.categories?.unshift({ id: 0, description: 'Избери категория', count: 0, countCars: 0, countParts: 0, groupModelId: 0 })
            })
    }
}
