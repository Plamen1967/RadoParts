import { HttpClient, HttpParams } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { map } from 'rxjs/operators'
import { environment } from '../../environments/environment'
import { Car } from '@model/car/car'
import { FilterCar } from '@model/filters/filterCar'

@Injectable({
    providedIn: 'root',
})
export class SeachCarService {
    constructor(private http: HttpClient) {}

    cars: Car[] = []
    fetch(filter: FilterCar) {
        let params = new HttpParams()

        params = params.set('companyId', `${filter.companyId}`)
        params = params.set('modelId', `${filter.modelId}`)
        params = params.set('powerkWh', `${filter.powerkWh}`)
        params = params.set('powerBHP', `${filter.powerBHP}`)
        params = params.set('carId', `${filter.carId}`)
        params = params.set('description', `${filter.description}`)

        return this.http.get<Car[]>(`${environment.restAPI}/Car/GetCars`, { params }).pipe(
            map((res) => {
                this.cars = res
                return res
            })
        )
    }
}
