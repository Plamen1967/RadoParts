//#region imports
import { HttpClient } from '@angular/common/http'
import { Injectable, inject } from '@angular/core'
import { handleError } from '@app/functions/handleError'
import { environment } from '@env/environment'
import { DealerSubCategory } from '@model/category-subcategory/dealerSubCategory'
import { catchError, Observable } from 'rxjs'
//#endregion
//#region service
@Injectable({
    providedIn: 'root',
})
//#endregion
export class DealerSubCategoryService {
    private http = inject(HttpClient)

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
