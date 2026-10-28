//#region imports
import { Component, DestroyRef, inject, OnInit, Self, model, input } from '@angular/core'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { NgControl, ReactiveFormsModule } from '@angular/forms'
import { CustomSelectComponent } from '@components/custom-controls/x-custom-select/customSelect.component'
import { MultiSelectionComponent } from '@components/custom-controls/select-controls/multiSelection/multiselection.component'
import { SubCategory } from '@model/category-subcategory/subCategory'
import { OptionItem } from '@model/optionitem'
import { SubCategoryService } from '@services/category-subcategory/subCategory.service'
import { ErrorService } from '@services/error.service'
import { FormValueControl, ValidationError } from '@angular/forms/signals'
import { MatTooltipModule, TooltipPosition } from '@angular/material/tooltip'
//#endregion
//#region component
@Component({
    selector: 'app-subcategory-choise',
    templateUrl: './subcategory-choise.component.html',
    styleUrls: ['./subcategory-choise.component.css'],
    imports: [MultiSelectionComponent, CustomSelectComponent, ReactiveFormsModule, MatTooltipModule],
})
//#endregion
export class SubcategoryChoiseComponent implements FormValueControl<string | number>, OnInit {
    //#region variables and services
    value = model<string | number>('')
    isDisabled?: boolean
    subCategories: OptionItem[] = []
    readonly errors = input<readonly ValidationError.WithOptionalFieldTree[]>([]);
    all = input<boolean>(false)
    multiselection = input<boolean>(true)
    categoriesId = input.required<string>()
    submitted = input<boolean>(false)
    isRequired = input<boolean>(false)
    //#region services
    public subCategoryService: SubCategoryService
    @Self() public control: NgControl
    public errorService: ErrorService
    private destroyRef: DestroyRef
    positionOptions: TooltipPosition[] = ['below', 'above', 'left', 'right'];
    //#endregion
    //#endregion

    constructor() {
        //#region inject services
        this.subCategoryService = inject(SubCategoryService)
        this.control = inject(NgControl)
        this.errorService = inject(ErrorService)
        this.destroyRef = inject(DestroyRef)
        //#endregion
    }
    ngOnInit(): void {
        this.initCategories()
    }
    setDisabledState?(isDisabled: boolean): void {
        this.isDisabled = isDisabled
    }

    initCategories() {
        this.subCategoryService
            .getSubCategoriesByCategoriesId(this.categoriesId())
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((res) => {
                const categories: SubCategory[] = []
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
                        imageName: '',
                        groupModelId: 0,
                    }
                    return cat
                })
            })
    }
}
