import { HttpClient, HttpParams } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { catchError, map, Observable, of, Subject } from 'rxjs'
import { Category } from '../../model/category-subcategory/category'
import { handleError } from '../../functions/handleError'
import { environment } from '@env/environment'
import { FilterCategory } from '@model/filters/filterCategory'
import { NumberPartsPerCategory } from '@model/category-subcategory/numberPartsPerCategory'
import { Dropdown } from '@model/dropDown'

@Injectable({
    providedIn: 'root',
})
export class CategoryService {
    categories?: Category[]
    _filtercategories: Observable<Dropdown[]>  = new Observable<Dropdown[]>();
    displayCategory = false;
    constructor(private http: HttpClient) {}
    private open: Subject<MouseEvent>  = new Subject<MouseEvent>();
    setFilterCategories(f: Dropdown[]) {
        return this._filtercategories = of([...f]);
      }

      openCategory() {
        return this.open;
      }
    fetch(): Observable<Category[]> {
        if (this.categories) return of(this.categories)

        return this.http.get<Category[]>(`${environment.restAPI}/category`).pipe(
            map((res) => (
                this.categories = res.map((category) => ({
                    ...category,
                    'imageName' : category.imageName = `images/categories/${category.imageName}`
                }))
            )),

            catchError(handleError<Category[]>('fetch categories', []))
        )
    }

    fetchPartsPerCategory(filter: FilterCategory): Observable<NumberPartsPerCategory[]> {
        const params = new HttpParams()
            .set('companyId', filter.companyId ?? 0)
            .set('modelId', filter.modelId ?? 0)
            .set('modelsId', filter.modelsId ?? '')
            .set('modificationId', filter.modificationId ?? 0)
            .set('modificationsId', filter.modificationsId ?? '')
            .set('bus', filter.bus ?? 0)
            .set('hasImages', filter.hasImages ?? 0)
            .set('userId', filter.userId ?? 0)

        return this.http
            .get<NumberPartsPerCategory[]>(`${environment.restAPI}/category/PartsPerCategory`, { params })
            .pipe(catchError(handleError<NumberPartsPerCategory[]>('fetch fetchPartsPerCategory', [])))
    }
}
