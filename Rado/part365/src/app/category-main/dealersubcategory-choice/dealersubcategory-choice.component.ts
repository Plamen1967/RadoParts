//#region imports
import { Component, DestroyRef, ElementRef, inject, model, input, output, effect, signal } from '@angular/core'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { ReactiveFormsModule } from '@angular/forms'
import { FormValueControl, ValidationError } from '@angular/forms/signals'
import { MatTooltipModule, TooltipPosition } from '@angular/material/tooltip'
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
    imports: [CustomSelectComponent, ReactiveFormsModule, MatTooltipModule],
})
//#endregion
export class DealersubcategoryChoiceComponent implements FormValueControl<number | string> {
    //#region variables and services
    value = model<number | string>(0)
    isDisabled?: boolean
    positionOptions: TooltipPosition[] = ['below', 'above', 'left', 'right'];

    dealerSubCategories = signal<OptionItem[]>([])
    dealercategories = signal<DealerSubCategory[]>([])

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    protected onTouched?() {}
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
    protected onChange?(_: number) {}
    readonly errors = input<readonly ValidationError.WithOptionalFieldTree[]>([])
    all = input<boolean>(false)
    multiselection = input<boolean>(true)
    submitted = input<boolean>(false)
    isRequired = input<boolean>(false)
    categoryId = input<number>(0)

    dealerSubCategoryChanged = output<DealerSubCategory>()
    //#region services
    public dealerSubCategoryService: DealerSubCategoryService
    public errorService: ErrorService
    private element: ElementRef
    private destroyRef: DestroyRef
    //#endregion
    //#endregion
    constructor() {
        //#region inject services
        this.dealerSubCategoryService = inject(DealerSubCategoryService)
        this.errorService = inject(ErrorService)
        this.element = inject(ElementRef)
        this.destroyRef = inject(DestroyRef)
        //#endregion
        effect(() => {
            this.initCategories(this.categoryId())
        })

        effect(() => {
            const dealerSubCategory = this.dealercategories().find((item) => item.dealerSubCategoryId === this.value())
            this.dealerSubCategoryChanged.emit(dealerSubCategory!)
        })
    }

    initCategories(categoryId: number) {
        if (categoryId) {
            this.dealerSubCategoryService
                .fetchByCategory(categoryId)
                .pipe(takeUntilDestroyed(this.destroyRef))
                .subscribe((res) => {
                    this.dealercategories.set([...res])

                    this.dealerSubCategories.set([
                        { id: 0, description: 'Избери Подкатегория Дилър', count: 0, countCars: 0, countParts: 0, groupModelId: 0 },
                        ...this.dealercategories().map((item) => {
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
                        }),
                    ])
                })
        } else {
            this.dealerSubCategories.set([{ id: 0, description: 'Избери Подкатегория Дилър', count: 0, countCars: 0, countParts: 0, groupModelId: 0 }])
        }
    }
}
