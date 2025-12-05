import { NgStyle, NgClass } from '@angular/common';
import { AfterViewInit, Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputComponent } from '@components/custom-controls/input/input.component';
import { SelectComponent } from '@components/custom-controls/select-controls/select/select.component';
import { HelperComponent } from '@components/custom-controls/helper/helper.component';
import { DealerSubCategory } from '@model/category-subcategory/dealerSubCategory';
import { AdminService } from '@services/admin.service';
import { CategoryService } from '@services/category-subcategory/category.service';
import { DealerSubCategoryService } from '@services/category-subcategory/dealerSubCategory.service';
import { SubCategoryService } from '@services/category-subcategory/subCategory.service';
import { SelectOption } from '@model/selectOption';

@Component({
  standalone: true,
  selector: 'app-dealersubcategory',
  templateUrl: './dealerSubCategory.component.html',
  styleUrls: ['./dealerSubCategory.component.css'],
  imports: [ReactiveFormsModule, NgStyle, SelectComponent, InputComponent, NgClass]
})
export default class DealerSubCategoryComponent extends HelperComponent implements AfterViewInit {

  dealerSubCategoryForm: FormGroup;
  categories: SelectOption[] = [];
  subCategories: SelectOption[] = [];
  originaldealerSubCategories : DealerSubCategory[] = [];
  dealerSubCategories: SelectOption[] = [];
  categoriesId?: string;
  subCategoryId?: number;
  dealerSubCategoryId?: number;
  dealerSubCategoryName?: string;

  constructor(private formBuilder: FormBuilder,
    private adminService: AdminService,
    private categoryService: CategoryService,
    private subCategoryService: SubCategoryService,
    private dealerSubCategoryService : DealerSubCategoryService) {
    super();

    this.dealerSubCategoryForm = formBuilder.group({
      categoryId: [''],
      subCategoryId: [''],
      dealerSubCategoryId: [''],
      dealerSubCategoryName: ['', Validators.required]
    })

    this.categoryService.fetch().subscribe(res => 
      this.categories = res.map(category => { return {
        value: category.categoryId, text: category.categoryName
      }})
    )
  }

  categoryIdChanged(categoriesId: string) {
    this.categoriesId = categoriesId;
    this.subCategoryService.getSubCategoriesByCategoriesId(categoriesId).subscribe(res => {
      this.subCategories = res.map(subCategory => {
        return {
          value: subCategory.categoryId, text: subCategory.subCategoryName
        }
      });
    })
  }

  subCategoryIdChanged(subCategoryId: number){
    this.subCategoryId = subCategoryId
    this.dealerSubCategoryService.fetch(this.subCategoryId).subscribe(res => {
      res.unshift({subCategoryId: 0, dealerSubCategoryId: 0, dealerSubCategoryName : this.labels.ADDDEALESUBCATEGORY, categoryId : 0})
      this.originaldealerSubCategories = res;
      this.dealerSubCategories = res.map(dealerSubCategory => {
        return {
          value: dealerSubCategory.dealerSubCategoryId, text: dealerSubCategory.dealerSubCategoryName
        }
      })
    })
  }

  dealerSubCategoryIdChanged(dealerSubCategoryId: number) {
    let dealerSubCategoryName = ''
    if (dealerSubCategoryId) {
      const dealerSubCategory = this.dealerSubCategories.find(item => item.value === dealerSubCategoryId)
      if (dealerSubCategory) {
        dealerSubCategoryName = dealerSubCategory?.text ?? '';
      }
    }

    this.dealerSubCategoryId = this.controls['dealerSubCategoryId'].value
    this.dealerSubCategoryForm.patchValue({dealerSubCategoryName : dealerSubCategoryName});
  }
  
  update() {
    this.adminService.updateDealerSubCategory(this.dealerSubCategoryForm.value).subscribe(res => {
      const dealerSubCategory = this.dealerSubCategories.find(item => item.value === res.dealerSubCategoryId);
      if (dealerSubCategory) {
        dealerSubCategory.text = res.dealerSubCategoryName
      } else {
        this.dealerSubCategories.push({value: res.dealerSubCategoryId, text: res.dealerSubCategoryName});
        this.dealerSubCategoryForm.patchValue({dealerSubCategoryName : ''})
      }
      this.dealerSubCategories.sort((x,y) => x.text!<y.text!?-1:1);
  })
  }

  delete() {
    this.adminService.deleteDealerSubCategory(this.dealerSubCategoryId!).subscribe(res => {
      if (res) {
          const index = this.dealerSubCategories.findIndex(item => item.value === this.dealerSubCategoryId);
          if (index != -1) this.dealerSubCategories.splice(index, 1);
          this.dealerSubCategoryForm.patchValue({dealerSubCategoryName : '', dealerSubCategoryId : 0});
        }
    })

  }
  get buttonLabel() {
    if (this.dealerSubCategoryId)
      return this.labels.UPDATE;
    else 
      return this.labels.ADDDEALESUBCATEGORY;  
  }

  get deleteButton() {
    return !this.dealerSubCategoryId;
  }

  get updateButton() {
    if (this.dealerSubCategoryId) return false;
    const dealerSubCategoryName = this.controls['dealerSubCategoryName'].value;
    if (dealerSubCategoryName?.length) return false;

    return true;
  }

  get controls() {
    return this.dealerSubCategoryForm.controls;
  }
  
  ngAfterViewInit(): void {
    this.controls['categoryId'].valueChanges.subscribe(categoryId => this.categoryIdChanged(categoryId))
    this.controls['subCategoryId'].valueChanges.subscribe(subCategoryId => this.subCategoryIdChanged(subCategoryId))
    this.controls['dealerSubCategoryId'].valueChanges.subscribe(dealerSubCategoryId => this.dealerSubCategoryIdChanged(dealerSubCategoryId))
  }
}
