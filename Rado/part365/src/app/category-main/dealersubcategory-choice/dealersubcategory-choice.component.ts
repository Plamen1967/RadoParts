//#region imports
import { Component, DestroyRef, ElementRef, inject, model, input, output, effect } from '@angular/core'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { FormBuilder, ReactiveFormsModule } from '@angular/forms'
import { FormValueControl } from '@angular/forms/signals'
import { TooltipDirective } from '@app/directive/tooltip.directive'
import { CustomSelectComponent } from '@components/custom-controls/x-custom-select/customSelect.component'
import { DealerSubCategory } from '@model/category-subcategory/dealerSubCategory'
import { OptionItem } from '@model/optionitem'
import { DealerSubCategoryService } from '@services/category-subcategory/dealerSubCategory.service'
import { ErrorService } from '@services/error.service'
//#endregion
//#region component
@Component({
    selector: 'app-dealersubcategory-choice',
    templateUrl: './dealersubcategory-choice.component.html',
    styleUrls: ['./dealersubcategory-choice.component.css'],
    imports: [TooltipDirective, CustomSelectComponent, ReactiveFormsModule],
})
//#endregion
export class DealersubcategoryChoiceComponent implements FormValueControl<number | string> {
    //#region variables and services
    value = model<number | string>(0)
    isDisabled?: boolean
    dealerSubCategories: OptionItem[] = []
    dealercategories: DealerSubCategory[] = []

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    protected onTouched?() {}
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
    protected onChange?(_: number) {}
    all = input<boolean>(false)
    multiselection = input<boolean>(true)
    submitted = input<boolean>(false)
    IsRequired = input<boolean>(false)
    categoryId = input<number>() 
    
    dealerSubCategoryChanged = output<DealerSubCategory>()
    //#region services
    public dealerSubCategoryService: DealerSubCategoryService
    private formBuilder: FormBuilder
    public errorService: ErrorService
    private element: ElementRef
    private destroyRef: DestroyRef
    //#endregion
    //#endregion
    constructor() {
        //#region inject services
        this.dealerSubCategoryService = inject(DealerSubCategoryService)
        this.formBuilder = inject(FormBuilder)
        this.errorService = inject(ErrorService)
        this.element = inject(ElementRef)
        this.destroyRef = inject(DestroyRef)
        //#endregion
        effect(() => {
            this.initCategories(this.categoryId()!)
        })

        effect(() => {
            const dealerSubCategory = this.dealercategories.find((item) => item.dealerSubCategoryId === this.value())
            this.dealerSubCategoryChanged.emit(dealerSubCategory!)
        })
    }

    initCategories(categoryId: number) {
        if (categoryId) {
            this.dealerSubCategoryService
                .fetchByCategory(categoryId)
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
                            imageName: '',
                            groupModelId: 0,
                        }
                        return cat
                    })
                })
        } else {
            this.dealerSubCategories = []
        }
        this.dealerSubCategories?.unshift({ id: 0, description: 'Избери Подкатегория Дилър', count: 0, countCars: 0, countParts: 0, groupModelId: 0 })
    }
}
