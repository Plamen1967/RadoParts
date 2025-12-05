import { HttpClient, HttpParams } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable, of } from 'rxjs'
import { catchError, map, tap } from 'rxjs/operators'
import { environment } from '@env/environment'
import { StaticSelectionService } from './staticSelection.service'
import { LoggerService } from './authentication/logger.service'
import { AuthenticationService } from './authentication/authentication.service'
import { Filter } from '@model/filters/filter'
import { SearchResult } from '@model/searchResult'
import { convertToParam } from '@app/functions/handleError'
import { DisplayPartView, Enrich } from '@model/displayPartView'
import { SaveSearchService } from './saveSearch.service'

@Injectable({
    providedIn: 'root',
})
export class SearchPartService {
    constructor(
        private http: HttpClient,
        private staticSelectionService: StaticSelectionService,
        private loggerService: LoggerService,
        private saveSearchService: SaveSearchService,
        private authenticationService: AuthenticationService
    ) {}

    searchForPartByNumber(filter: Filter): Observable<SearchResult> {
        if (!filter.userId) filter.id = Date.now()
        filter.clientId = this.authenticationService.clientId
        filter.loadMainPicture = true
        let params = new HttpParams()
        params = params.set('partNumber', `${filter['partNumber']}`)

        return this.http.get<SearchResult>(`${environment.restAPI}/Search/SearchForPartByNumber`, { params }).pipe(
            map((res) => {
                this.saveSearchService.save(res.filter!)
                res.data?.forEach((part) => {
                    Enrich(part, this.staticSelectionService)
                })
                return res
            }),
            tap(() => this.loggerService.log('searchForPartByNumber')),
            catchError(this.handleError<SearchResult>('fetch searchForPartByNumber', undefined))
        )
    }

    search(filter: Filter): Observable<SearchResult> {
        filter.id = Date.now()
        filter.clientId = this.authenticationService.clientId
        filter.loadMainPicture = true
        filter.clientId = this.authenticationService.clientId
        const params = convertToParam(filter)

        return this.http.get<SearchResult>(`${environment.restAPI}/Search/Search`, { params }).pipe(
            map((res) => {
                this.saveSearchService.save(res.filter!)
                res.data?.forEach((part) => {
                    Enrich(part, this.staticSelectionService)
                })
                return res
            }),
            tap(() => {
                this.loggerService.log('search')
    }       ),
            catchError(this.handleError<SearchResult>('fetch search', undefined))
        )
    }

    getSearchResult(query: number) {
        let params = new HttpParams()
        params = params.set('query', `${query}`)
        return this.http.get<SearchResult>(`${environment.restAPI}/Search/GetSearchResult`, { params }).pipe(
            map((res) => {
                res.data?.forEach((part) => {
                    Enrich(part, this.staticSelectionService)
                })
                return res
            }),
            tap(() => this.loggerService.log('getSearchResult')),
            catchError(this.handleError<SearchResult>('fetch getSearchResult', undefined))
        )
    }

    getItem(id: number) {
        let params = new HttpParams()
        params = params.set('id', `${id}`)
        return this.http.get<DisplayPartView>(`${environment.restAPI}/Search/getitem`, { params }).pipe(
            map((part) => {
                    Enrich(part, this.staticSelectionService)
                return part
            }),
            tap(() => this.loggerService.log('getSearchResult')),
            catchError(this.handleError<DisplayPartView>('fetch getSearchResult', {}))
        )
    }

    getFilter(query: number): Observable<Filter> {
        let params = new HttpParams()
        params = params.set('query', `${query}`)
        return this.http.get<Filter>(`${environment.restAPI}/Search/GetFilter`, { params }).pipe(
            tap(() => this.loggerService.log('getSearchResult')),
            catchError(this.handleError<Filter>('fetch getSearchResult', undefined))
        )
    }

    handleError<T>(operation: string, returnValue?: T) {
        return () => {
            this.loggerService.logError(`operation ${operation} failed`)
            return of(returnValue as T)
        }
    }
}
