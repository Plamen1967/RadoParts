//#region imports
import { Component, inject, OnInit, model, input, effect, computed } from '@angular/core'
import { ReactiveFormsModule } from '@angular/forms'
import { CustomSelectComponent } from '@components/custom-controls/x-custom-select/customSelect.component'
import { MultiSelectionComponent } from '@components/custom-controls/select-controls/multiSelection/multiselection.component'
import { Category } from '@model/category-subcategory/category'
import { OptionItem } from '@model/optionitem'
import { CategoryService } from '@services/category-subcategory/category.service'
import { ErrorService } from '@services/error.service'
import { FormValueControl, ValidationError } from '@angular/forms/signals'
import { httpResource } from '@angular/common/http'
import { environment } from '@env/environment'
import { MatTooltipModule, TooltipPosition } from '@angular/material/tooltip'
//#endregion
//#region component
@Component({
    selector: 'app-category-choise',
    templateUrl: './category-choise.component.html',
    styleUrls: ['./category-choise.component.css'],
    imports: [MultiSelectionComponent, CustomSelectComponent, ReactiveFormsModule,
    MatTooltipModule],
})
//#endregion
export class CategoryChoiseComponent implements FormValueControl<string | number>, OnInit {
    //#region variables and services
    value = model<string | number>('')
    isDisabled?: boolean
    categories: OptionItem[] = []
    all = input<boolean>(false)
    multiselection = input<boolean>(true)
    submitted = input<boolean>(false)
    isRequired = input<boolean>(false)
    positionOptions: TooltipPosition[] = ['below', 'above', 'left', 'right'];

    readonly errors = input<readonly ValidationError.WithOptionalFieldTree[]>([]);
    //#region services
    public categoryService: CategoryService
    public errorService: ErrorService
    //#endregion
    //#endregion

    $categoryResource = httpResource<Category[]>(() => `${environment.restAPI}/category`
    )

    $category = computed(() => {
        if (!this.$categoryResource.hasValue()) return []
        const category = this.$categoryResource.value()
        const categories: Category[] = []
        category.forEach((item) => {
            let category = new Category()
            category = Object.assign(category, item)
            categories?.push(category)
            item['count'] = 0
        })

        const options: OptionItem[] = categories.map((item) => {
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
                
        options.unshift({ id: 0, description: 'Избери категория', count: 0, countCars: 0, countParts: 0, groupModelId: 0 })
        return options ?? []

    })
    constructor() {
        this.categoryService = inject(CategoryService)
        this.errorService = inject(ErrorService)

        effect(() => {
            console.log(`Category Value: ${this.value()}`)
        })

        effect(() => {
            console.log(`Category: ${this.$category()}`)
        })
    }
    ngOnInit(): void {
        this.initCategories()
    }

    setDisabledState?(isDisabled: boolean): void {
        this.isDisabled = isDisabled
    }

    initCategories() {
        this.categoryService
            .fetch()
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
