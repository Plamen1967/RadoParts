import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, first, map, tap } from 'rxjs/operators';
import { environment } from '@env/environment';
import { LoggerService } from './authentication/logger.service';
import { StaticSelectionService } from './staticSelection.service';
import { Car } from '@model/car/car';
import { CarNameId } from '@model/carNameId';
import { CarView } from '@model/car/carView';
import { UpdateEnum } from '@model/enum/update.enum';
import { DisplayPartView, Enrich } from '@model/displayPartView';
import { PartView } from '@model/part/partView';
import { removeUndefined } from '@app/functions/functions';
import { Filter } from '@model/filters/filter';

@Injectable({
  providedIn: 'root'
})
export class CarService {

  constructor(private http: HttpClient,
    private loggerService: LoggerService,
    private staticSelectionService: StaticSelectionService) {

  }
  httpHeader = {
    headers: new HttpHeaders({
      'content-type': 'application/json',
      'accept': '*/*'
    })
  }

  resetCurrentId() {
    this.currentId = undefined;
  }

  currentId?:  number;
  currentCarId?: number;

  cars?: Car[];

  fetch(modelId: number) {
    const params = new HttpParams()
      .set("modelId", `${modelId}`);

    return this.http.get<Car[]>(`${environment.restAPI}/car/GetCarsByModel`, { params })
      .pipe(first(),
        map(res => this.cars = res));
  }

  fetchCarNameId(bus: number): Observable<CarNameId[]> {
    let params = new HttpParams();
    params = params.set('bus', `${bus??0}`)
    return this.http.get<CarNameId[]>(`${environment.restAPI}/car/GetCarNameId`, { params })
      .pipe(first(),
        tap(() => this.loggerService.log("fetch cars GetCarNameId")),
        catchError(this.handleError("fetch cars GetCarNameId", []))
      )


  }
  fetchBusNameId(): Observable<CarNameId[]> {
    return this.http.get<CarNameId[]>(`${environment.restAPI}/car/GetCarNameId`)
      .pipe(first(),
        tap(() => this.loggerService.log("fetch cars GetCarNameId")),
        catchError(this.handleError("fetch cars GetCarNameId", []))
      )


  }

  fetchCars(filterCar: Filter): Observable<CarView[]> {
    let params = new HttpParams();
    for(const property in filterCar) {
      const propertyValue = filterCar[property as keyof typeof filterCar];
      if (propertyValue && propertyValue !== 0 )
        params = params.set(property, `${filterCar[property as keyof typeof filterCar]}`)
    }
    return this.http.get<CarView[]>(`${environment.restAPI}/car/GetCars`, { params })
      .pipe(first(),
        tap(() => this.loggerService.log("fetch cars")),
        catchError(this.handleError("fetch cars", []))
      )


  }

  validateCarName(carId: number, regNumber: string): Observable<boolean> {
    let params = new HttpParams();
    params = params.set('carId', `${carId}`)
    params = params.set('regNumber', `${regNumber}`)
    return this.http.get<boolean>(`${environment.restAPI}/car/ValidateName`, { params })
      .pipe(first(),
        tap(() => this.loggerService.log("fetch cars")),
        catchError(this.handleError("fetch cars", false))
      )
  } 

  fetchCar(carId: number): Observable<CarView> {
    return this.http.get<CarView>(`${environment.restAPI}/car/${carId}`)
      .pipe(first(),
        tap(() => this.loggerService.log(`fetch car: ${carId}`)),
        catchError(this.handleError<CarView>("fetch car", new CarView()))
      )
  }

  // deleteCar(carId: number): Observable<boolean> {
  //   return this.http.post<boolean>(`${environment.restAPI}/car/deletecar`, JSON.stringify({id: carId}), this.httpHeader)
  //     .pipe(first(),
  //       tap(() => this.loggerService.log(`fetch car: ${carId}`)),
  //       catchError(this.handleError<boolean>("fetch car", true))
  //     )
  // }

  addUpdateCar(car: Car, update: UpdateEnum): Observable<DisplayPartView> {

    let carTemp: Car;
    
    carTemp = {...car};
    if (!carTemp.price) carTemp.price = 0;
    if (!carTemp.powerkWh) carTemp.powerkWh = 0;
    if (!carTemp.powerBHP) carTemp.powerBHP = 0;
    if (!carTemp.millage) carTemp.millage = 0;
    
    if (carTemp.bus) carTemp.modificationId = 0
    carTemp.mainImageId = +carTemp.mainImageId!;

    carTemp.modifiedTime = Date.now();
    carTemp = removeUndefined<Car>(carTemp);
  
    if (update === UpdateEnum.New)
      return this.http.post<DisplayPartView>(`${environment.restAPI}/car`, JSON.stringify(carTemp), this.httpHeader).pipe(map(res => {
          Enrich(res, this.staticSelectionService);
        return res;
      }));
    else
      return this.http.patch<DisplayPartView>(`${environment.restAPI}/car/${car.carId}`, JSON.stringify(carTemp), this.httpHeader).pipe(map(res => {
        Enrich(res, this.staticSelectionService);
      return res;
    }));
  }

  deleteCar(carId: number): Observable<boolean> {
    return this.http.post<boolean>(`${environment.restAPI}/car/delete`, {id: carId})
      .pipe(first(),
        tap(() => this.loggerService.log(`fetch car: ${carId}`)),
      )
  }
  
  handleError<T>(operation: string, returnValue?: T) {
    return () => {
      this.loggerService.logError(`operation ${operation} failed`);
      return of(returnValue as T);
    }

  }

  getPartsByCarId(carId: number): Observable<PartView[]> {

    let params = new HttpParams();
    params = params.set("carId", `${carId}`);

    return this.http.get<PartView[]>(`${environment.restAPI}/Part/GetPartsByCarId`, { params })
      .pipe(first(),
        tap(() => this.loggerService.log('GetPartsByCarId')),
      );

  }


  checkForUniqueness(regName: string, bus: number) {
    let params = new HttpParams();
    params = params.set("carName", `${regName}`);
    params = params.set("bus", `${bus}`);
    return this.http.get<boolean>(`${environment.restAPI}/car/CheckForUniqueness`, { params })
      .pipe(first(),
        tap(() => this.loggerService.log('checkForUniqueness')),
      )
  }
 
}
