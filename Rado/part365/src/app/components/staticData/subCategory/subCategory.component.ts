import { NgClass, NgStyle } from '@angular/common';
import { AfterViewInit, Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputComponent } from '@components/custom-controls/input/input.component';
import { SelectComponent } from '@components/custom-controls/select-controls/select/select.component';
import { HelperComponent } from '@components/custom-controls/helper/helper.component';
import { SubCategory } from '@model/category-subcategory/subCategory';
import { AdminService } from '@services/admin.service';
import { CategoryService } from '@services/category-subcategory/category.service';
import { SubCategoryService } from '@services/category-subcategory/subCategory.service';
import { SelectOption } from '@model/selectOption';
@Component({
  standalone: true,
  selector: 'app-subcategory',
  templateUrl: './subCategory.component.html',
  styleUrls: ['./subCategory.component.css'],
  imports: [ReactiveFormsModule, InputComponent, NgStyle, SelectComponent, NgClass]

})
export default class SubCategoryComponent extends HelperComponent implements AfterViewInit {

  subCategoryForm: FormGroup;
  categories: SelectOption[] = [];
  subCategories: SelectOption[] = [];
  categoryId?: number;
  subCategoryId?: number;

  constructor(private formBuilder: FormBuilder,
    private adminService: AdminService,
    private categoryService: CategoryService,
    private subCategoryService: SubCategoryService,) {
    super();

    this.subCategoryForm = formBuilder.group({
      categoryId: [''],
      subCategoryId: [''],
      subCategoryName: ['', Validators.required]
    })

    this.categoryService.fetch().subscribe(res => this.categories = res)
  }

  get controls() {
    return this.subCategoryForm.controls;
  }
  ngAfterViewInit(): void {
    this.controls['categoryId'].valueChanges.subscribe(f => this.categoryChanged(f))
    this.controls['subCategoryId'].valueChanges.subscribe(f => this.subCategoryChanged(f))
  }

  categoryChanged(categoryId: number) {
    this.categoryId = categoryId;
    this.subCategoryService.getSubCategoriesByCategoriesId(categoryId.toString()).subscribe(res => {
      res.unshift({ categoryId: 0, subCategoryId: 0, subCategoryName: this.labels.ADDSUBCATEGORY })
      this.subCategories = res.map((category) => {
        return {
          value: category.categoryId, text: category.subCategoryName
        }
      });
    })
  }

  subCategoryChanged(subCategoryId: number) {
    this.subCategoryId = subCategoryId;
    let subCategoryName = '';
    if (subCategoryId) {
      const subCategory = this.subCategories.find(item => item.value === subCategoryId);
      subCategoryName = subCategory?.text ?? ''
    }

    this.subCategoryForm.patchValue({ subCategoryName: subCategoryName });
  }

  updateSubCategory() {
    this.adminService.updateSubCategory(this.subCategoryForm.value).subscribe((subcategory) => { this.updateSubCategories(subcategory) })
  }

  delete() {
    this.adminService.deleteSubCategory(this.subCategoryId!).subscribe((res) => {
      if (res) {
        const index = this.subCategories.findIndex(item => item.value === this.subCategoryId);
        if (index != -1) this.subCategories.splice(index, 1);
        this.subCategoryForm.patchValue({subCategoryName : ''});
      }

    } )
  }

  updateSubCategories(subcategory: SubCategory) {
    const subcategory_ = this.subCategories.find(item => item.value === subcategory.subCategoryId);
    if (subcategory_)
      subcategory_.text = subcategory.subCategoryName
    else {
      this.subCategories.push({
        value: subcategory.categoryId, text: subcategory.subCategoryName
      });
      this.subCategoryForm.patchValue({subCategoryName : '', subCategoryId : 0})
    }

    this.subCategories.sort((x,y) => {
      return x.text! < y.text! ? -1 : 1;
    });
  }

  get buttonLabel() {
    if (this.subCategoryId)
      return this.labels.UPDATE;
    else 
      return this.labels.ADD;  
  }

  get deleteButton() {
    return !this.subCategoryId;
  }

  get updateButton() {
    if (this.subCategoryId) return false;
    const subCategoryName = this.controls['subCategoryName'].value;
    if (subCategoryName?.length) return false;

    return true;
  }

}
