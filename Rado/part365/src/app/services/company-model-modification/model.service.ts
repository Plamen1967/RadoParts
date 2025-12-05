import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { handleError } from '@app/functions/handleError'
import { environment } from '@env/environment'
import { getModelAll, Model } from '@model/company-model-modification/model'
import { catchError, map, Observable } from 'rxjs'

@Injectable({
    providedIn: 'root',
})
export class ModelService {
    constructor(private http: HttpClient) {}

    fetchByCompanyId(companyId: number): Observable<Model[]> {
      return this.http
          .get<Model[]>(`${environment.restAPI}/model/GetModelsByCompanyId`, { params: { companyId: companyId } })
          .pipe(catchError(handleError('fetchByCompanyId', [])))
  }

  fetchByCompanyIdByUserId(companyId: number): Observable<Model[]> {
    return this.http
        .get<Model[]>(`${environment.restAPI}/model/GetModelsPerUser`, { params: { companyId: companyId } })
        .pipe(catchError(handleError('fetchByCompanyId', [])))
}

  fetchByCompanyWithAll(companyId: number): Observable<Model[]> {
        return this.fetchByCompanyId(companyId).pipe(
            map((res) => {
                res.unshift(getModelAll())
                return res
            }),
            catchError(handleError('fetchByCompanyWithAll', []))
        )
    }

    fetchModel(modelId : number) : Observable<Model> {
      return this.http.get<Model>(`${environment.restAPI}/model/${modelId}`)
            .pipe(
              catchError(handleError('fetchModel', new Model()))
            )
    }
  
    addModel(model : Model) { 
      return this.http.post<Model>(`${environment.restAPI}/model`, model)
        .pipe(
          catchError(handleError<Model>('addModel', new Model()))
        )
    }  
}
