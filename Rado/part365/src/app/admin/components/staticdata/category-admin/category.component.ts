//#region imports
import { NgClass, NgStyle } from '@angular/common'
import { Component, effect, inject, OnInit, signal } from '@angular/core'
import { FormBuilder, ReactiveFormsModule } from '@angular/forms'
import { InputComponent } from '@components/custom-controls/input/input.component'
import { SelectComponent } from '@components/custom-controls/select-controls/select/select.component'
import { HelperComponent } from '@components/custom-controls/helper/helper.component'
import { Category } from '@model/category-subcategory/category'
import { AdminService } from '@app/admin/services/admin.service'
import { CategoryService } from '@services/category-subcategory/category.service'
//#endregion
//#region component
@Component({
    selector: 'app-category-admin',
    templateUrl: './category.component.html',
    styleUrls: ['./category.component.css'],
    imports: [ReactiveFormsModule, NgStyle, InputComponent, SelectComponent, NgClass],
})
//#endregion
export default class CategoryComponent extends HelperComponent implements OnInit {
    //#region variables and services
    categories?: Category[]
    categoryId = signal<number>(0)
    categoryName = signal<string>('')
    formBuilder: FormBuilder = inject(FormBuilder)
    private categoryService: CategoryService = inject(CategoryService)
    private adminService: AdminService = inject(AdminService)
    //#endregion

    constructor() {
        super()
        effect(() => this.select(this.categoryId()))
    }

    ngOnInit() {
        this.categoryService.fetch().subscribe((res) => {
            this.categories = [...res]
            this.categories.unshift({ categoryId: 0, categoryName: this.labels.ADDCATEGORY, imageName: '', count: 0 })
        })
    }

    select(categoryId: number) {
        let categoryName = ''

        if (categoryId !== 0) {
            const category_ = this.categories?.find((elem) => elem.categoryId === categoryId)
            categoryName = category_?.categoryName ?? ''
        } else {
            this.categoryName.set(categoryName)
        }
    }

    update() {
        const category: Category = {
            categoryId: this.categoryId(),
            categoryName: this.categoryName(),
            imageName: '',
            count: 0,
        }

        this.adminService.updateCategory(category).subscribe((res) => this.updateCategoryList(res))
    }

    delete() {
        this.adminService.deleteCategory(this.categoryId()).subscribe((res) => {
            if (res) {
                const index = this.categories?.findIndex((item) => item.categoryId === this.categoryId())
                if (index != -1) this.categories?.splice(index!, 1)
                this.categoryName.set('')
                this.categoryId.set(0)
            }
        })
    }

    updateCategoryList(category: Category) {
        const category_ = this.categories?.find((elem) => elem.categoryId === category.categoryId)
        if (category_) category_.categoryName = category.categoryName
        else {
            this.categories?.push(category)
            this.categoryName.set('')
            this.categoryId.set(0)
        }
        this.categories?.sort((x, y) => (x.categoryName < y.categoryName ? -1 : 1))
    }

    get buttonLabel() {
        if (this.categoryId()) return this.labels.UPDATE
        else return this.labels.ADD
    }

    get deleteButton() {
        return !this.categoryId
    }

    get updateButton() {
        if (this.categoryId()) return false
        const categoryName = this.controls['categoryName'].value
        if (categoryName?.length) return false

        return true
    }
}
