//#region imports
import { Component, inject, OnInit, model, input, effect } from '@angular/core'
import { ReactiveFormsModule } from '@angular/forms'
import { TooltipDirective } from '@app/directive/tooltip.directive'
import { CustomSelectComponent } from '@components/custom-controls/x-custom-select/customSelect.component'
import { MultiSelectionComponent } from '@components/custom-controls/select-controls/multiSelection/multiselection.component'
import { Category } from '@model/category-subcategory/category'
import { OptionItem } from '@model/optionitem'
import { CategoryService } from '@services/category-subcategory/category.service'
import { ErrorService } from '@services/error.service'
import { FormValueControl } from '@angular/forms/signals'
//#endregion
//#region component
@Component({
    selector: 'app-category-choise',
    templateUrl: './category-choise.component.html',
    styleUrls: ['./category-choise.component.css'],
    imports: [MultiSelectionComponent, TooltipDirective, CustomSelectComponent, ReactiveFormsModule],
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
    //#region services
    public categoryService: CategoryService
    public errorService: ErrorService
    //#endregion
    //#endregion

    constructor() {
        this.categoryService = inject(CategoryService)
        this.errorService = inject(ErrorService)

        effect(() => {
            console.log(`Category Value: ${this.value()}`)
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
