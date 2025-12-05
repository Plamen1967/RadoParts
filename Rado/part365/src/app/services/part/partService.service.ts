import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Part } from '@model/part/part'
import { Observable, of, Subject } from 'rxjs'
import { catchError, first, tap, map } from 'rxjs/operators'
import { LoggerService } from '../authentication/logger.service'
import { StaticSelectionService } from '../staticSelection.service'
import { PartView } from '@model/part/partView'
import { environment } from '@env/environment'
import { DisplayPartView, Enrich } from '@model/displayPartView'
import { Filter } from '@model/filters/filter'
import { convertToParam } from '@app/functions/handleError'

@Injectable({
    providedIn: 'root',
})
export class PartServiceService {
    Result?: Part[]
    constructor(
        private http: HttpClient,
        private loggerService: LoggerService,
        private staticService: StaticSelectionService
    ) {}

    httpHeader = {
        headers: new HttpHeaders({
            'content-type': 'application/json',
            accept: '*/*',
        }),
    }

    currentId: Subject<number | undefined> = new Subject<number | undefined>()
    currentPartId?: number

    resetCurrentId() {
        this.currentId.next(undefined)
    }

    fetchPartsForCar(carId: number): Observable<PartView[]> {
        const params = new HttpParams().set('carId', `${carId}`)
        return this.http.get<PartView[]>(`${environment.restAPI}/part/GetPartsByCarId`, { params }).pipe(
            first(),
            tap(() => this.loggerService.log(`Search for GetPartsByCarId ${carId}`)),
            catchError(this.handleError('fetch GetPartsByCarId', []))
        )
    }

    fetch(partId: number): Observable<PartView> {
        return this.http.get<PartView>(`${environment.restAPI}/part/${partId}`).pipe(
            first(),
            tap(() => this.loggerService.log(`Search for part ${partId}`)),
            catchError(this.handleError('fetch part', new PartView()))
        )
    }

    fetchDisplayPartView(id: number): Observable<DisplayPartView> {
        const params = new HttpParams().set('id', `${id}`)
        return this.http.get<DisplayPartView>(`${environment.restAPI}/search/GetItem`, { params }).pipe(
            map((res) => {
                res = Enrich(res, this.staticService)
                return res
            })
        )
    }

    getPartViews(filter: Filter): Observable<PartView[]> {
        let params = new HttpParams()
        for(const property in filter) {
            const propertyValue = filter[property as keyof typeof filter];
            if (propertyValue != undefined && propertyValue != null)
                params = params.set(property, `${propertyValue}`);
          }
        return this.http.get<PartView[]>(`${environment.restAPI}/part/GetParts`, {params}).pipe(
            first(),
            tap(() => this.loggerService.log(`Search for part ${filter}`))
        )
    }

    deletePartTest() {
        return this.http.delete(`${environment.restAPI}/part/1`, { responseType: 'text' })
    }

    deletePart(partId: number): Observable<boolean> {
        return this.http.post<boolean>(`${environment.restAPI}/part/delete`, {id: partId}).pipe(
            first(),
            tap(() => this.loggerService.log(`delete part ${partId}`))
        )
    }

    // deletePart(partId : number) {
    //   return this.http.delete(`${environment.restAPI}/part/${partId}}`).pipe(first());
    // }

    addUpdatePart(part: Part, update: boolean) {
        part.modifiedTime = Date.now()
        for(const property in part) {
            const propertyValue = part[property as keyof typeof part];
            if (propertyValue === undefined || propertyValue === null)
                delete part[property as keyof typeof part];
          }
      
        if (update) {
            return this.updatePart(part.partId!, part)
        } else {
            return this.addPart(part)
        }
    }

    addPart(part: Part): Observable<DisplayPartView> {
        return this.http.post<DisplayPartView>(`${environment.restAPI}/part`, part, this.httpHeader).pipe(map((item) => Enrich(item, this.staticService)))
    }
    updatePart(partId: number, part: Part): Observable<DisplayPartView> {
        return this.http.patch<DisplayPartView>(`${environment.restAPI}/part/${partId}`, part, this.httpHeader).pipe(map((item) => Enrich(item, this.staticService)))
    }

    handleError<T>(operation: string, returnValue?: T) {
        return () => {
            this.loggerService.logError(`operation ${operation} failed`)
            return of(returnValue as T)
        }
    }
    fetchPerUser(filter: Filter): Observable<PartView[]> {
        filter.partOnly = true
        const params = convertToParam<Filter>(filter)

        return this.http.get<PartView[]>(`${environment.restAPI}/Part/GetParts`, { params }).pipe(
            first(),
            map((res) => {
                return res
            }),
            tap(() => this.loggerService.log('search')),
        )
    }
}
