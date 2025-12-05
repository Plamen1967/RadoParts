import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';

import { Observable, of } from 'rxjs';
import { catchError, first, tap } from 'rxjs/operators';
import { LoggerService } from './authentication/logger.service';
import { Category } from '@model/category-subcategory/category';
import { SubCategory } from '@model/category-subcategory/subCategory';
import { DealerSubCategory } from '@model/category-subcategory/dealerSubCategory';
import { Company } from '@model/company-model-modification/company';
import { Model } from '@model/company-model-modification/model';
import { Modification } from '@model/static-data/modification';
import { UserTrades } from '@model/userTrades';
import { User } from '@model/user';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  httpHeader = {
    headers: new HttpHeaders({
      'content-type': 'application/json',
      'accept': '*/*'
    })
  }


  constructor(private http: HttpClient,
    private loggerService: LoggerService) { }

  
  updateApprovedStatus(id: number, approved: number): Observable<boolean> {
    return this.http.post<boolean>(`${environment.restAPI}/admin/approveAd`,{id, approved});
  }  
  getCompanyName(): Observable<string> {
    return this.http.get(`${environment.restAPI}/admin`,{responseType: 'text'});
  }  
  updateCategory(category: Category): Observable<Category> {
    return this.http.post<Category>(`${environment.restAPI}/admin/updateCategory`, category, this.httpHeader)
      .pipe(first()
        , tap(() => this.loggerService.log(`update category: ${category.categoryId}`)),
        catchError(this.handleError<Category>("update category", category)))
  }

  deleteCategory(categoryId: number): Observable<boolean> {
    return this.http.post<boolean>(`${environment.restAPI}/admin/deleteCategory`, categoryId, this.httpHeader)
      .pipe(first()
        , tap(() => this.loggerService.log(`delete category: ${categoryId}`)))
  }


  addCategory(categoryName: string): Observable<Category> {
    return this.http.post<Category>(`${environment.restAPI}/admin/addCategory`, JSON.stringify({ categoryName: categoryName, categoryId: 0 }), this.httpHeader)
      .pipe(first()
        , tap(() => this.loggerService.log(`update category: ${categoryName}`)))
  }

  updateSubCategory(subCategory: SubCategory) {
    return this.http.post<SubCategory>(`${environment.restAPI}/admin/updateSubCategory`, JSON.stringify(subCategory), this.httpHeader)
      .pipe(first()
        , tap(() => this.loggerService.log(`update subCtegory: ${subCategory.categoryId}`)),
        catchError(this.handleError<SubCategory>("update subCategory", subCategory)))
  }

  addSubCategory(subCategoryName: string) {
    return this.http.post<SubCategory>(`${environment.restAPI}/admin/addSubCategory`, JSON.stringify({ subCategoryName: subCategoryName, subCategoryId: 0 }), this.httpHeader)
      .pipe(first()
        , tap(() => this.loggerService.log(`add category: ${subCategoryName}`)))
  }

  deleteSubCategory(subCategoryId: number) {
    return this.http.post<boolean>(`${environment.restAPI}/admin/deleteSubCategory`, subCategoryId, this.httpHeader)
      .pipe(first()
        , tap(() => this.loggerService.log(`delete subCtegory: ${subCategoryId}`)),
        catchError(this.handleError<boolean>("delete subCategory", false)))
  }

  updateDealerSubCategory(dealerSubCategory: DealerSubCategory) {
    return this.http.post<DealerSubCategory>(`${environment.restAPI}/admin/updateDealerSubCategory`, JSON.stringify(dealerSubCategory), this.httpHeader)
      .pipe(first()
        , tap(() => this.loggerService.log(`update subCtegory: ${dealerSubCategory.dealerSubCategoryId}`)),
        catchError(this.handleError<DealerSubCategory>("update subCategory", dealerSubCategory)))
  }

  deleteDealerSubCategory(dealerSubCategoryId: number) {
    return this.http.post<boolean>(`${environment.restAPI}/admin/deleteDealerSubCategory`,  dealerSubCategoryId, this.httpHeader)
      .pipe(first()
        , tap(() => this.loggerService.log(`delete dealerSubCtegory: ${dealerSubCategoryId}`)),
        catchError(this.handleError<boolean>("delete dealerSubCategory", false)))
  }

  addSubDealerCategory(dealerSubCategoryName: string) {
    return this.http.post<DealerSubCategory>(`${environment.restAPI}/admin/addDealerSubCategory`, JSON.stringify({ dealerSubCategoryName: dealerSubCategoryName, dealerSubCategoryId: 0 }), this.httpHeader)
      .pipe(first()
        , tap(() => this.loggerService.log(`add category: ${dealerSubCategoryName}`)))
  }

  updateCompany(company: Company) {
    return this.http.post<Company>(`${environment.restAPI}/admin/updateCompany`, JSON.stringify(company), this.httpHeader)
      .pipe(first()
        , tap(() => this.loggerService.log(`update Company: ${company.companyId}`)),
        catchError(this.handleError<Company>("update Company", company)))
  }

  updateModel(model: Model) {
    return this.http.post<Model>(`${environment.restAPI}/admin/updateModel`, JSON.stringify(model), this.httpHeader)
      .pipe(first()
        , tap(() => this.loggerService.log(`update Model: ${model.modelId}`)),
        catchError(this.handleError<Model>("update Model", model)))
  }

  deleteModel(modelId: number) {
    return this.http.post<boolean>(`${environment.restAPI}/admin/deleteModel`, modelId, this.httpHeader)
      .pipe(first()
        , tap(() => this.loggerService.log(`update Model: ${modelId}`)),
        catchError(this.handleError<boolean>("update Model", false)))
  }

  updateModification(modification: Modification) {
    return this.http.post<Modification>(`${environment.restAPI}/admin/updateModification`, JSON.stringify(modification), this.httpHeader)
      .pipe(first()
        , tap(() => this.loggerService.log(`update Modification: ${modification.modificationId}`)),
        catchError(this.handleError<Modification>("update Modification", modification)))
  }

  deleteModification(modificationId: number) {
    return this.http.post<boolean>(`${environment.restAPI}/admin/deleteModification`, modificationId, this.httpHeader)
      .pipe(first()
        , tap(() => this.loggerService.log(`update Model: ${modificationId}`)),
        catchError(this.handleError<boolean>("update Modification", false)))
  }

  updatePassword(guid: string, password : string) {
    return this.http.post<boolean>(`${environment.restAPI}/admin/updatePassword`, {guid: guid, password: password}, this.httpHeader)
      .pipe(first()
        , tap(() => this.loggerService.log(`recover Password: ${guid}`)),
        catchError(this.handleError<boolean>("recover Password", false)))
  }


  recoverPassword(userId: number): Observable<string> {
    return this.http.post<string>(`${environment.restAPI}/admin/recoverPassword`, userId, this.httpHeader)
      .pipe(first()
        , tap(() => this.loggerService.log(`recover Password: ${userId}`)),
        catchError(this.handleError<string>("recover Password", "")))
  }

  suspendUser(userId: number): Observable<User> {
    const suspendedDateTime = Date.now();
    return this.http.post<User>(`${environment.restAPI}/admin/suspendUser`, {userId, suspendedDateTime:suspendedDateTime}, this.httpHeader)
      .pipe(first()
        , tap(() => this.loggerService.log(`suspendUser: ${userId}`)))
  }


  getUserStats(userId: number): Observable<UserTrades> {
    return this.http.get<UserTrades>(`${environment.restAPI}/admin/getUserCount?id=${userId}`);
  }

  unSuspendUser(userId: number): Observable<User> {
    return this.http.post<User>(`${environment.restAPI}/admin/unsuspendUser`, {userId, suspendDateTime:0}, this.httpHeader)
      .pipe(first()
        , tap(() => this.loggerService.log(`recover Password: ${userId}`)))
  }
  handleError<T>(operation: string, returnValue?: T) {
    return () => {
      this.loggerService.logError(`operation ${operation} failed`);
      return of(returnValue as T);
    }
  }
}
