import { NgClass, NgStyle } from '@angular/common';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputComponent } from '@components/custom-controls/input/input.component';
import { SelectComponent } from '@components/custom-controls/select-controls/select/select.component';
import { HelperComponent } from '@components/custom-controls/helper/helper.component';
import { Category } from '@model/category-subcategory/category';
import { AdminService } from '@services/admin.service';
import { CategoryService } from '@services/category-subcategory/category.service';

@Component({
  standalone: true,
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css'],
  imports: [ReactiveFormsModule, NgStyle, InputComponent, SelectComponent, NgClass]
})
export default class CategoryComponent extends HelperComponent implements OnInit, AfterViewInit {

  categoryForm: FormGroup;
  categories?: Category[];
  categoryId?: number;

  constructor(formBuilder: FormBuilder,
    private categoryService: CategoryService,
    private adminService: AdminService) {
    super();
    this.categoryForm = formBuilder.group({
      categoryId: ['', [Validators.required]],
      categoryName: ['', [Validators.required]]
    })
  }
  ngAfterViewInit(): void {
    this.categoryForm.controls['categoryId'].valueChanges.subscribe(f => this.select(f))
  }

  ngOnInit() {
    this.categoryService.fetch().subscribe((res) => {
      this.categories = [...res];
      this.categories.unshift({ categoryId: 0, categoryName: this.labels.ADDCATEGORY, imageName: '', count: 0 })
    })
  }


  select(categoryId: number) {
    let categoryName = "";
    this.categoryId = categoryId;

    if (categoryId !== 0) {
      const category_ = this.categories?.find((elem) => elem.categoryId === categoryId)
      categoryName = category_?.categoryName ?? ''
    } else {
      this.categoryForm.patchValue({ categoryName: categoryName });
    }

  }

  update() {
    const category: Category = {
      categoryId: this.categoryForm.controls['categoryId'].value,
      categoryName: this.categoryForm.controls['categoryName'].value, imageName: "", count: 0
    };

    this.adminService.updateCategory(category).subscribe(res => this.updateCategoryList(res))
  }

  delete() {
    this.adminService.deleteCategory(this.categoryId!).subscribe((res) => {
      if (res) {
        const index = this.categories?.findIndex(item => item.categoryId === this.categoryId);
        if (index != -1) this.categories?.splice(index!, 1);
        this.categoryForm.patchValue({categoryName : '', categoryId: 0});
      }

    } )
  }

  updateCategoryList(category: Category) {
    const category_ = this.categories?.find((elem) => elem.categoryId === category.categoryId)
    if (category_)
    category_.categoryName = category.categoryName
  else {
    this.categories?.push(category);
    this.categoryForm.patchValue({categoryName : '', categoryId: 0})
  }
  this.categories?.sort((x,y) => x.categoryName<y.categoryName?-1:1);

}

  get buttonLabel() {
    if (this.categoryId)
      return this.labels.UPDATE;
    else
      return this.labels.ADD;
  }

  get deleteButton() {
    return !this.categoryId;
  }

  get controls() {
    return this.categoryForm.controls
  }

  get updateButton() {
    if (this.categoryId) return false;
    const categoryName = this.controls['categoryName'].value;
    if (categoryName?.length) return false;

    return true;
  }

}


