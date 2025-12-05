import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { handleError } from '@app/functions/handleError'
import { environment } from '@env/environment'
import { SubCategory } from '@model/category-subcategory/subCategory'
import { catchError, Observable } from 'rxjs'

@Injectable({
    providedIn: 'root',
})
export class SubCategoryService {
    private subCategories: Map<number, Observable<SubCategory[]>> = new Map<number, Observable<SubCategory[]>>()

    constructor(private http: HttpClient) {}

    // fetch(categoryId: number): Observable<SubCategory[]> {
    //     if (this.subCategories.has(categoryId)) return this.subCategories.get(categoryId) ?? []

    //     const params = new HttpParams().set('categoryId', `${categoryId}`)
    //     return this.http.get<SubCategory[]>(`${environment.restAPI}/subcategory/GetSubCategoriesByCategoryId`, { params }).pipe(
    //         tap((res) => this.subCategories.set(categoryId, of(res))),
    //         catchError(handleError('get subcateory', of ([]))
    //     )
    // }

    getSubCategoriesByCategoriesId(categoriesId: string): Observable<SubCategory[]> {
        return this.http
            .get<SubCategory[]>(`${environment.restAPI}/subcategory/GetSubCategoriesByCategoriesId`, { params: { categoryId: categoriesId ?? '' } })
            .pipe(catchError(handleError('get subcateoris by categoris id', [])))
    }
}
