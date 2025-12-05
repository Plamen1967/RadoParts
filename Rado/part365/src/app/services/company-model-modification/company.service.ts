import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { handleError } from '@app/functions/handleError'
import { environment } from '@env/environment'
import { Company, getBusCompanyAll, getCompanyAll } from '@model/company-model-modification/company'
import { catchError, map, Observable, of, switchMap } from 'rxjs'

@Injectable({
    providedIn: 'root',
})
export class CompanyService {
    public companies?: Company[]
    public buscompanies?: Company[]

    constructor(private http: HttpClient) {}

    fetchCompanies(): Observable<Company[]> {
        if (this.companies) return of(this.companies)

        return this.http.get<Company[]>(`${environment.restAPI}/company`).pipe(
            switchMap((res) => {
                this.companies = [...res]
                return of(res)
            }),
            catchError(handleError('fetch bus companies', []))
        )
    }

    fetchCompaniesByUserId(): Observable<Company[]> {
        return this.http.get<Company[]>(`${environment.restAPI}/company/GetCompaniesByUserId`).pipe(
            switchMap((res) => {
                return of(res)
            }),
            catchError(handleError('fetch car companies by user Id', []))
        )
    }

    fetchCompaniesWithAll(): Observable<Company[]> {
        if (this.companies) return of([getCompanyAll(), ...this.companies])

        return this.fetchCompanies().pipe(
            map((res) => {
                res.unshift(getCompanyAll())
                return res
            })
        )
    }

    fetchBusCompanies(): Observable<Company[]> {
        if (this.buscompanies) return of(this.buscompanies)

        return this.http.get<Company[]>(`${environment.restAPI}/company/getbuscompanies`, {}).pipe(
            switchMap((res) => {
                this.buscompanies = [...res]
                return of(res)
            }),
            catchError(handleError('fetch bus companies', []))
        )
    }
    fetchBusCompaniesByUserId(): Observable<Company[]> {
        return this.http.get<Company[]>(`${environment.restAPI}/company/GetBusCompaniesByUserId`, {}).pipe(
            switchMap((res) => {
                return of(res)
            }),
            catchError(handleError('fetch bus companies  by user Id', []))
        )
    }

    fetchBusCompaniesWithAll(): Observable<Company[]> {
        if (this.buscompanies) return of([getBusCompanyAll(), ...this.buscompanies])

        return this.fetchBusCompanies().pipe(
            map((res) => {
                res.unshift(getBusCompanyAll())
                return res
            })
        )
    }
}
