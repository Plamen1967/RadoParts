import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { handleError } from '@app/functions/handleError'
import { environment } from '@env/environment'
import { DealerSubCategory } from '@model/category-subcategory/dealerSubCategory'
import { catchError, Observable } from 'rxjs'

@Injectable({
    providedIn: 'root',
})
export class DealerSubCategoryService {
    constructor(private http: HttpClient) {}

    fetch(subCategoryId: number): Observable<DealerSubCategory[]> {
        return this.http
            .get<DealerSubCategory[]>(`${environment.restAPI}/dealerSubCategories/GetDealerSubCategoryPerSubCategory`, { params: { id: subCategoryId } })
            .pipe(catchError(handleError<DealerSubCategory[]>('fetch fetchByCategory', [])))
    }

    fetchByCategory(categoryId: number) {
        return this.http
            .get<DealerSubCategory[]>(`${environment.restAPI}/dealerSubCategories/GetDealerSubCategoryPerCategory`, { params: { id: categoryId } })
            .pipe(catchError(handleError<DealerSubCategory[]>('fetch fetchByCategory', [])))
    }

    fetchDealerSubCategory(dealerSubCategoryId: number) {
        return this.http
            .get<DealerSubCategory>(`${environment.restAPI}/dealerSubCategories/${dealerSubCategoryId}`)
            .pipe(catchError(handleError<DealerSubCategory>('fetch fetchByCategory', new DealerSubCategory())))
    }
}
