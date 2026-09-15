//#region Imports
import { NgClass, NgStyle } from '@angular/common'
import { Component, effect, inject, model } from '@angular/core'
import { FormBuilder, ReactiveFormsModule } from '@angular/forms'
import { InputComponent } from '@components/custom-controls/input/input.component'
import { SelectComponent } from '@components/custom-controls/select-controls/select/select.component'
import { HelperComponent } from '@components/custom-controls/helper/helper.component'
import { SubCategory } from '@model/category-subcategory/subCategory'
import { AdminService } from '@app/admin/services/admin.service'
import { CategoryService } from '@services/category-subcategory/category.service'
import { SubCategoryService } from '@services/category-subcategory/subCategory.service'
import { SelectOption } from '@model/selectOption'
//#endregion
//#region Component
@Component({
    selector: 'app-subcategory-admin',
    templateUrl: './subCategory.component.html',
    styleUrls: ['./subCategory.component.css'],
    imports: [ReactiveFormsModule, InputComponent, NgStyle, SelectComponent, NgClass],
})
//#endregion
export default class SubCategoryComponentAdmin extends HelperComponent{
    //#region variables and services
    categories: SelectOption[] = []
    subCategories: SelectOption[] = []
    categoryId = model<number>(0)
    subCategoryId = model<number>(0)
    subCategoryName = model<string>('')
    //#region services
    private formBuilder: FormBuilder = inject(FormBuilder)
    private adminService: AdminService = inject(AdminService)
    private categoryService: CategoryService = inject(CategoryService)
    private subCategoryService: SubCategoryService = inject(SubCategoryService)
    //#endregion
    //#endregion


    constructor() {
        super()
        effect(() => {
            this.categoryChanged(this.categoryId())
        })

        effect(() => {
            this.subCategoryChanged(this.subCategoryId())
        })
        this.categoryService.fetch().subscribe((res) => (this.categories = res))
    }

    categoryChanged(categoryId: number) {
        this.subCategoryService.getSubCategoriesByCategoriesId(categoryId.toString()).subscribe((res) => {
            res.unshift({ categoryId: 0, subCategoryId: 0, subCategoryName: this.labels.ADDSUBCATEGORY })
            this.subCategories = res.map((category) => {
                return {
                    value: category.categoryId,
                    text: category.subCategoryName,
                }
            })
        })
    }

    subCategoryChanged(subCategoryId: number) {
        if (subCategoryId) {
            const subCategory = this.subCategories.find((item) => item.value === subCategoryId)
            this.subCategoryName.set(subCategory?.text ?? '')
        }
    }

    updateSubCategory() {
        this.adminService.updateSubCategory({subCategoryId: this.subCategoryId(), categoryId: this.categoryId(), subCategoryName: this.subCategoryName()}).subscribe((subcategory) => {
            this.updateSubCategories(subcategory)
        })
    }

    delete() {
        this.adminService.deleteSubCategory(this.subCategoryId()).subscribe((res) => {
            if (res) {
                const index = this.subCategories.findIndex((item) => item.value === this.subCategoryId())
                if (index != -1) this.subCategories.splice(index, 1)
                this.subCategoryName.set('')
            }
        })
    }

    updateSubCategories(subcategory: SubCategory) {
        const subcategory_ = this.subCategories.find((item) => item.value === subcategory.subCategoryId)
        if (subcategory_) subcategory_.text = subcategory.subCategoryName
        else {
            this.subCategories.push({
                value: subcategory.categoryId,
                text: subcategory.subCategoryName,
            })
            this.subCategoryName.set('')
            this.subCategoryId.set(0)
        }

        this.subCategories.sort((x, y) => {
            return x.text! < y.text! ? -1 : 1
        })
    }

    get buttonLabel() {
        if (this.subCategoryId()) return this.labels.UPDATE
        else return this.labels.ADD
    }

    get deleteButton() {
        return !this.subCategoryId
    }

    get updateButton() {
        if (this.subCategoryId()) return false
        const subCategoryName = this.controls['subCategoryName'].value
        if (subCategoryName?.length) return false

        return true
    }
}
